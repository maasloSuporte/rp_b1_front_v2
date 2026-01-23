import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { devicesService } from '../services/devices.service';
import { useModalStore } from '../services/modal.service';
import { useNotificationStore } from '../services/notification.service';
import DynamicTable from '../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../types/table';
import type { IPaginationOutputDto, IDevicesGetOutputDto } from '../types/models';

export default function Device() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('');

  const columns: TableColumn[] = [
    {
      key: 'machineName',
      label: 'Name',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'environment',
      label: 'Environment',
      filterable: true,
      sortable: false,
      filterType: 'text'
    },
    {
      key: 'hostName',
      label: 'Hostname',
      filterable: true,
      sortable: false,
      filterType: 'text'
    },
    {
      key: 'ip',
      label: 'IP',
      filterable: true,
      sortable: false,
      filterType: 'text'
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'action'
    }
  ];

  const actionMenuItems: ActionMenuItem[] = [
    {
      label: 'Edit',
      action: 'edit',
      icon: 'edit'
    },
    {
      label: 'Deleted',
      action: 'deleted',
      icon: 'block',
    }
  ];

  useEffect(() => {
    loadDevices();
  }, [queryString]);

  const loadDevices = async () => {
    try {
      const result: IPaginationOutputDto<IDevicesGetOutputDto> = 
        await devicesService.getAllDevices(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map(x => ({
        id: x.id,
        machineName: x.machineName,
        environment: x.environment,
        hostName: x.hostName,
        ip: x.ip
      })));
    } catch (error) {
      console.error('Erro ao carregar devices:', error);
    }
  };

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'edit':
        navigate(`/machine/${event.item.id}`);
        break;
      case 'deleted':
        const confirmed = await confirmDelete({
          itemName: event.item.hostName
        });
        if (confirmed) {
          try {
            await devicesService.deleteDevice({ id: event.item.id });
            showToast('Sucess', 'Machine deleted successfully', 'success');
            loadDevices();
          } catch (error) {
            showToast('Error', 'Failed to delete machine', 'error');
          }
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-text-primary">Machines</h1>
        <button
          onClick={() => navigate('/machine/create')}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Create Machine Template
        </button>
      </div>
      <section className="bg-white rounded-lg shadow-card p-4">
        <DynamicTable
          columns={columns}
          data={data}
          totalItems={totalItems}
          pageSize={5}
          pageSizeOptions={[5, 10, 25, 100]}
          showFirstLastButtons={true}
          actionMenuItems={actionMenuItems}
          onActionClick={handleActionClick}
          onQueryParamsChange={setQueryString}
        />
      </section>
    </div>
  );
}
