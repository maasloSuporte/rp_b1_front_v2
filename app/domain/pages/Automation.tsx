import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { projectsService } from '../../service/projects.service';
import { useModalStore } from '../../service/modal.service';
import { useNotificationStore } from '../../service/notification.service';
import type { IPaginationOutputDto, IProjectGetAllOutputDto } from '../../types/models';
import type { ActionMenuItem, TableColumn } from '../../types/table';
import DynamicTable from '../../components/DynamicTable';

/** Projeto exibido na tabela: active é mapeado para 'Ativo' | 'Inativo' */
type ProjectTableRow = Omit<IProjectGetAllOutputDto, 'active'> & { active: string };

export default function Automation() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [projects, setProjects] = useState<ProjectTableRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [queryString, setQueryString] = useState('SortField=id&SortOrder=asc&PageNumber=1&PageSize=100');

  useEffect(() => {
    loadProjects();
  }, [queryString]);

  const loadProjects = async () => {
    try {
      const result: IPaginationOutputDto<IProjectGetAllOutputDto> = 
        await projectsService.getAllProjects({ pageNumber: 1, pageSize: 100 }, queryString);
      setProjects(
        result.items.map((p): ProjectTableRow => ({
          ...p,
          active: p.active ? 'Ativo' : 'Inativo',
        }))
      );
      setTotalCount(result.totalItems);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const columns: TableColumn[] = [
    {
      key: 'name',
      filterKey: 'ProjectName',
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
      filterKey: 'Status',
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

  const handleDelete = async (project: ProjectTableRow) => {
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
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">Automation</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/project')}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
          >
            Create Project
          </button>
          <button
            onClick={() => navigate('/execution')}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-purple hover:bg-purple/90 shadow-sm hover:shadow transition-all duration-200"
          >
            Execute
          </button>
        </div>
      </div>

      <section className="mt-6">
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
