import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { companyUserService } from '../../service/companyUser.service';
import { usersService } from '../../service/users.service';
import { useModalStore } from '../../service/modal.service';
import { useNotificationStore } from '../../service/notification.service';
import DynamicTable from '../../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { ICompanyUserGetUsersOutputDto, IPaginationOutputDto } from '../../types/models';

export default function Users() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const confirmEnable = useModalStore((state) => state.confirmEnable);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('SortField=id&SortOrder=asc&PageNumber=1&PageSize=100');

  const columns: TableColumn[] = [
    {
      key: 'email',
      sortKey: 'User.Email',
      label: 'Email',
      filterable: true,
      sortable: true,
      filterType: 'text',
    },
    {
      key: 'role',
      label: 'Role',
      filterable: true,
      sortable: false,
      filterType: 'select',
      selectMode: 'multiple',
      filterOptions: []
    },
    {
      key: 'active',
      label: 'Status',
      filterable: true,
      filterType: 'select',
      selectMode: 'single',
      sortable: true,
      filterOptions: [
        { id: 'true', label: 'Ativo' },
        { id: 'false', label: 'Inativo' }
      ]
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'action'
    }
  ];

  const actionMenuItems: ActionMenuItem[] = [
    {
      label: 'Editar',
      action: 'edit',
      icon: 'edit'
    },
    {
      label: 'Desativar',
      action: 'disable',
      icon: 'block',
      showCondition: (item: any) => item.activeValue
    },
    {
      label: 'Ativar',
      action: 'enable',
      icon: 'check_circle',
      showCondition: (item: any) => !item.activeValue
    }
  ];



  const loadRoles = async () => {
    try {
      const roles = await companyUserService.getRoles();
      const roleColumn = columns.find(col => col.key === 'rolesId');
      if (roleColumn) {
        roleColumn.filterOptions = roles.map(role => ({
          id: role.id,
          label: role.name
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const result: IPaginationOutputDto<ICompanyUserGetUsersOutputDto> = await companyUserService.getAllUsers(queryString);
      console.log(result);
      
      setTotalItems(result.totalItems);
      setData(result.items.map((x: ICompanyUserGetUsersOutputDto) => ({
        id: x.userId,
        email: x.userEmail,
        role: x.userRoles.map((y: string) => y).join(', ') || '',
        rolesId: (x.userRoles as string[])?.map((y: string) => y).join(', ') || '',
        active: x.userActive ? 'Ativo' : 'Inativo',
        activeValue: x.userActive,
      })));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'edit':
        navigate(`/users/${event.item.id}`);
        break;
      case 'disable':
        const confirmedDelete = await confirmDelete({
          description: 'This action will permanently disable',
          itemName: event.item.email,
          buttonName: 'Yes, Disabled'
        });
        if (confirmedDelete) {
          try {
            await usersService.disabledUser({
              id: Number(event.item.id),
              callerEmail: event.item.email
            });
            showToast('Success', 'User successfully disabled', 'success');
            loadUsers();
          } catch (error) {
            showToast('Error', 'Failed to disable user', 'error');
          }
        }
        break;
      case 'enable':
        const confirmedEnable = await confirmEnable({
          itemName: event.item.email,
        });
        if (confirmedEnable) {
          try {
            await usersService.enabledUser({
              id: Number(event.item.id),
              callerEmail: event.item.email
            });
            showToast('Success', 'User successfully active', 'success');
            loadUsers();
          } catch (error) {
            showToast('Error', 'Failed to enable user', 'error');
          }
        }
        break;
    }
  };

  const loadfunctions = async () => {
    await loadRoles();
    await loadUsers();
  };

  useEffect(() => {
    loadfunctions().then();
  }, [queryString]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">Users</h1>
        <button
          onClick={() => navigate('/users/create')}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
        >
          Create User
        </button>
      </div>
      <section className="mt-6">
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
