import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsService } from '../services/projects.service';
import { useModalStore } from '../services/modal.service';
import { useNotificationStore } from '../services/notification.service';
import type { IPaginationOutputDto, IProjectGetAllOutputDto } from '../types/models';
import type { ActionMenuItem, TableColumn } from '../types/table';
import DynamicTable from '../components/DynamicTable';

export default function Automation() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [projects, setProjects] = useState<IProjectGetAllOutputDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [queryString, setQueryString] = useState('SortField=id&SortOrder=asc&PageNumber=1&PageSize=100');

  useEffect(() => {
    loadProjects();
  }, [queryString]);

  const loadProjects = async () => {
    try {
      const result: IPaginationOutputDto<IProjectGetAllOutputDto> = 
        await projectsService.getAllProjects({ pageNumber: 1, pageSize: 100 }, queryString);
      setProjects(result.items);
      setTotalCount(result.totalItems);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Name',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'packageVersionId',
      label: 'Package Version',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'active',
      label: 'Status',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'createdAt',
      label: 'Criado em',
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

  const handleDelete = async (project: IProjectGetAllOutputDto) => {
    const confirmed = await confirmDelete({
      itemName: project.name
    });
    if (confirmed) {
      try {
        await projectsService.deleteProject({ id: project.id });
        showToast('Sucess', 'Project deleted successfully', 'success');
        loadProjects();
      } catch (error) {
        showToast('Error', 'Failed to delete project', 'error');
      }
    }
  };

  const actionMenuItems: ActionMenuItem[] = [
    {
      label: 'Editar',
      action: 'edit',
      icon: 'edit'
    },
    {
      label: 'Delete',
      action: 'delete',
      icon: 'trash',
    },
  ];

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'edit':
        navigate(`/project/${event.item.id}`);
        break;
      case 'delete': await handleDelete(event.item)
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-text-primary">Automation</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/project')}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Create Project
          </button>
          <button
            onClick={() => navigate('/execution')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Execute
          </button>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow-card p-4">
        <DynamicTable
          columns={columns}
          data={projects}
          totalItems={totalCount}
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
