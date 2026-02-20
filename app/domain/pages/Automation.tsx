import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { projectsService } from '../../service/projects.service';
import { useModalStore } from '../../service/modal.service';
import { useNotificationStore } from '../../service/notification.service';
import type { IPaginationOutputDto, IProjectGetAllOutputDto } from '../../types/models';
import type { ActionMenuItem, TableColumn } from '../../types/table';
import DynamicTable from '../../components/DynamicTable';

function formatCreatedAt(value: string | null | undefined): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return String(value);
  }
}

/** Projeto exibido na tabela: active e createdAt formatados */
type ProjectTableRow = Omit<IProjectGetAllOutputDto, 'active' | 'createdAt'> & {
  active: string;
  createdAt: string;
};

export default function Automation() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [rawProjects, setRawProjects] = useState<IProjectGetAllOutputDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [queryString, setQueryString] = useState('SortField=id&SortOrder=asc&PageNumber=1&PageSize=100');

  const projects = useMemo(
    () =>
      rawProjects.map(
        (p): ProjectTableRow => ({
          ...p,
          active: p.active ? t('common.status.active') : t('common.status.inactive'),
          createdAt: formatCreatedAt(p.createdAt),
        })
      ),
    [rawProjects, t]
  );

  useEffect(() => {
    loadProjects();
  }, [queryString]);

  const loadProjects = async () => {
    try {
      const result: IPaginationOutputDto<IProjectGetAllOutputDto> = 
        await projectsService.getAllProjects({ pageNumber: 1, pageSize: 100 }, queryString);
      setRawProjects(result.items);
      setTotalCount(result.totalItems);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const columns: TableColumn[] = useMemo(
    () => [
    {
      key: 'name',
      filterKey: 'ProjectName',
      label: t('pages.automation.columnName'),
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'packageVersionId',
      label: t('pages.automation.columnPackageVersion'),
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'active',
      filterKey: 'Status',
      label: t('pages.automation.columnStatus'),
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'createdAt',
      label: t('pages.automation.columnCreatedAt'),
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'actions',
      label: t('common.actions.label'),
      type: 'action'
    }
  ],
    [t]
  );

  const actionMenuItems: ActionMenuItem[] = useMemo(
    () => [
      {
        label: t('pages.automation.edit'),
        action: 'edit',
        icon: 'edit'
      },
      {
        label: t('pages.automation.delete'),
        action: 'delete',
        icon: 'trash',
      },
    ],
    [t]
  );

  const handleDelete = async (project: ProjectTableRow) => {
    const confirmed = await confirmDelete({
      itemName: project.name,
    });
    if (!confirmed) return;
    const id = Number(project.id);
    console.log('[Automation] Excluir projeto - item da tabela:', project);
    console.log('[Automation] Excluir projeto - id numérico:', id, 'isFinite:', Number.isFinite(id));
    if (!Number.isFinite(id)) {
      showToast(t('common.states.error'), t('pages.automation.deleteError'), 'error');
      return;
    }
    try {
      console.log('[Automation] Chamando deleteProject com payload:', { id });
      await projectsService.deleteProject({ id });
      console.log('[Automation] deleteProject sucesso');
      showToast(t('common.states.success'), t('pages.automation.deleteSuccess'), 'success');
      loadProjects();
    } catch (error: any) {
      const data = error.response?.data;
      console.log('[Automation] Erro ao excluir projeto - status:', error.response?.status);
      console.log('[Automation] Erro ao excluir projeto - response.data:', data);
      console.log('[Automation] Erro ao excluir projeto - request URL:', error.config?.url);
      console.log('[Automation] Erro ao excluir projeto - request method:', error.config?.method);
      console.log('[Automation] Erro ao excluir projeto - error completo:', error);
      const isDbError = data?.exception === 'DbUpdateException' || error.response?.status === 500;
      const message = isDbError
        ? t('pages.automation.deleteErrorDb')
        : (data?.message ?? data?.title ?? error.message ?? t('pages.automation.deleteError'));
      showToast(t('common.states.error'), message, 'error');
      console.error('Erro ao excluir projeto:', data ?? error);
    }
  };

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
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">{t('pages.automation.title')}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/project')}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
          >
            {t('pages.automation.createProject')}
          </button>
          <button
            onClick={() => navigate('/execution')}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-purple hover:bg-purple/90 shadow-sm hover:shadow transition-all duration-200"
          >
            {t('pages.automation.execute')}
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
