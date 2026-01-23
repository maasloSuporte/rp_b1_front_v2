import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleService } from '../services/schedule.service';
import { useModalStore } from '../services/modal.service';
import { useNotificationStore } from '../services/notification.service';
import DynamicTable from '../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../types/table';
import type { IPaginationOutputDto, IScheduleGetAllOutputDto } from '../types/models';

export default function ScheduledActivities() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('');

  const columns: TableColumn[] = [
    {
      key: 'Name',
      label: 'Name',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'Priority',
      label: 'Priority',
      filterable: false,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'NextExecution',
      label: 'Next execution',
      filterable: false,
      sortable: true,
      filterType: 'text',
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
      icon: 'deleted',
    }
  ];

  useEffect(() => {
    loadSchedule();
  }, [queryString]);

  const loadSchedule = async () => {
    try {
      const result: IPaginationOutputDto<IScheduleGetAllOutputDto> = 
        await scheduleService.getAllSchedule(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map(x => ({
        id: x.id,
        Name: x.name,
        Priority: x.priority,
        NextExecution: x.nextExecution
      })));
    } catch (error) {
      console.error('Erro ao buscar schedules:', error);
    }
  };

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'edit':
        navigate(`/scheduled/${event.item.id}`);
        break;
      case 'deleted':
        const confirmed = await confirmDelete({
          itemName: event.item.Name,
        });
        if (confirmed) {
          try {
            await scheduleService.deleteSchedule({ id: event.item.id });
            showToast('Sucess', 'Schedule deleted successfully', 'success');
            loadSchedule();
          } catch (error) {
            showToast('Error', 'Failed to delete schedule', 'error');
          }
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-text-primary">Schedules</h1>
        <button
          onClick={() => navigate('/scheduled/create')}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Create Schedule
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
