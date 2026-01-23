import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rolesService } from '../services/roles.service';
import { useModalStore } from '../services/modal.service';
import { useNotificationStore } from '../services/notification.service';
import DynamicTable from '../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../types/table';
import type { IRolesGetOutputDto, IPaginationOutputDto } from '../types/models';

export default function Roles() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('');

  const columns: TableColumn[] = [
    {
      key: 'name',
      sortKey: 'name',
      label: 'Name',
      filterable: true,
      sortable: false,
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
      icon: 'block',
    }
  ];

  useEffect(() => {
    loadRoles();
  }, [queryString]);

  const loadRoles = async () => {
    try {
      const result: IPaginationOutputDto<IRolesGetOutputDto> = 
        await rolesService.getAllRolesFilter(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map(x => ({
        id: x.id,
        name: x.name
      })));
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    }
  };

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'edit':
        navigate(`/permissions/${event.item.id}`);
        break;
      case 'deleted':
        const confirmed = await confirmDelete({
          itemName: event.item.name,
        });
        if (confirmed) {
          try {
            await rolesService.deleteRole({ id: event.item.id });
            showToast('Sucess', 'Permission group successfully deleted', 'success');
            loadRoles();
          } catch (error) {
            showToast('Error', 'Failed to delete role', 'error');
          }
        }
        break;
    }
  };

  return (
    <div className="p-5 min-h-screen bg-background">
      <h1 className="text-4xl font-semibold text-text-primary mb-4">Roles</h1>
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => navigate('/permissions')}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Add role <span className="ml-1">+</span>
        </button>
      </div>
      <section className="bg-white rounded-lg shadow-card p-4">
        <DynamicTable
          columns={columns}
          data={data}
          totalItems={totalItems}
          pageSize={10}
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
