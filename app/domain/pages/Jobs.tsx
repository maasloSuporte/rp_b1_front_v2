import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { jobService } from '../../service/job.service';
import { useNotificationStore } from '../../service/notification.service';
import { useModalStore } from '../../service/modal.service';
import DynamicTable from '../../components/DynamicTable';
import CreateJobModal from '../../components/modals/CreateJobModal';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { IPaginationOutputDto, IJobGetAllOutputDto } from '../../types/models';

export default function Jobs() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const showToast = useNotificationStore((state) => state.showToast);
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('PageNumber=1&PageSize=5&SortField=id&SortOrder=asc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const columns: TableColumn[] = useMemo(
    () => [
      { key: '_select', label: '', type: 'checkbox' },
      { key: 'Name', label: t('pages.jobs.columnName'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'HostName', label: t('pages.jobs.hostName'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'ProjectName', label: t('pages.jobs.projectName'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'MachineUser', label: t('pages.jobs.machineUser'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'State', label: t('pages.jobs.state'), filterable: false, sortable: false, filterType: 'text' },
      { key: 'Priority', label: t('pages.jobs.priority'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'PackageVersion', label: t('pages.jobs.robotVersion'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'StartedAt', label: t('pages.jobs.startedAt'), filterable: false, sortable: true, filterType: 'text' },
      { key: 'EndedAt', label: t('pages.jobs.endedAt'), filterable: false, sortable: false, filterType: 'text' },
      { key: 'actions', label: t('common.actions.label'), type: 'action' },
    ],
    [t]
  );

  const actionMenuItems: ActionMenuItem[] = useMemo(
    () => [
      { label: t('pages.jobs.preview'), action: 'preview', icon: 'preview' },
      { label: t('pages.jobs.execute'), action: 'execute', icon: 'play' },
      { label: t('common.buttons.delete'), action: 'delete', icon: 'trash' },
    ],
    [t]
  );

  useEffect(() => {
    loadJobs();
  }, [queryString]);

  const loadJobs = async () => {
    try {
      const result: IPaginationOutputDto<IJobGetAllOutputDto> = 
        await jobService.getAllJobs(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map((x: IJobGetAllOutputDto) => ({
        id: x.id,
        Name: x.name,
        HostName: x.hostname,
        MachineUser: x.machineUser,
        State: x.state,
        Priority: x.priority,
        StartedAt: x.started,
        EndedAt: x.ended,
        Robot: x.robot,
        PackageVersion: x.packageVersion,
        ProjectName: x.projectName,
      })));
    } catch (error) {
      console.error('Erro ao carregar jobs:', error);
    }
  };

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'preview':
        navigate(`/job-details/${event.item.id}`);
        break;
      case 'execute':
        await handleExecuteJob(event.item.id);
        break;
      case 'delete':
        await handleDeleteJob(event.item);
        break;
    }
  };

  const handleDeleteJob = async (item: { id: number; Name?: string }) => {
    const confirmed = await confirmDelete({ itemName: item.Name ?? `Job #${item.id}` });
    if (!confirmed) return;
    try {
      await jobService.deleteJob(item.id);
      showToast(t('common.states.success'), t('pages.jobs.deleteSuccess'), 'success');
      setSelectedIds((prev) => prev.filter((id) => id !== item.id));
      loadJobs();
    } catch (error: any) {
      const message = error.response?.data?.message ?? t('pages.jobs.deleteError');
      showToast(t('common.states.error'), message, 'error');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = await confirmDelete({
      itemName: `${selectedIds.length} job(s)`,
      description: t('pages.jobs.deleteSelectedConfirmDescription'),
    });
    if (!confirmed) return;
    let ok = 0;
    let fail = 0;
    for (const id of selectedIds) {
      try {
        await jobService.deleteJob(id);
        ok++;
      } catch {
        fail++;
      }
    }
    setSelectedIds([]);
    loadJobs();
    if (fail === 0) {
      showToast(t('common.states.success'), t('pages.jobs.deleteMultipleSuccess', { count: ok }), 'success');
    } else {
      showToast(t('common.warning'), t('pages.jobs.deleteMultiplePartial', { ok, fail }), 'error');
    }
  };

  const handleSelectionChange = (id: number, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleDeleteAllJobs = async () => {
    const confirmed = await confirmDelete({
      itemName: t('pages.jobs.deleteAllConfirmItemName'),
      description: t('pages.jobs.deleteAllConfirmDescription'),
      buttonName: t('pages.jobs.deleteAllConfirmButton'),
    });
    if (!confirmed) return;
    try {
      const result = await jobService.deleteAllJobs();
      setSelectedIds([]);
      loadJobs();
      showToast(t('common.states.success'), t('pages.jobs.clearAllSuccess', { count: result.deletedCount }), 'success');
    } catch (error: any) {
      const message = error.response?.data?.message ?? t('pages.jobs.deleteError');
      showToast(t('common.states.error'), message, 'error');
    }
  };

  const handleExecuteJob = async (jobId: number) => {
    try {
      await jobService.executeJob(jobId);
      showToast(t('common.states.success'), t('pages.jobs.executeSuccess'), 'success');
      loadJobs();
    } catch (error: any) {
      const message = error.response?.data?.message || t('pages.jobs.deleteError');
      showToast(t('common.states.error'), message, 'error');
    }
  };

  const handleCreateJob = async (jobData: { name: string; projectId: number; priorityId: number; machineId: number } | null) => {
    if (!jobData) {
      setIsCreateModalOpen(false);
      return;
    }
    try {
      await jobService.createJob(jobData);
      showToast(t('common.states.success'), t('pages.jobs.createSuccess'), 'success');
      setIsCreateModalOpen(false);
      loadJobs();
    } catch (error: any) {
      const message = error.response?.data?.message || t('pages.jobs.createError');
      showToast(t('common.states.error'), message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">{t('pages.jobs.title')}</h1>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDeleteAllJobs}
            disabled={totalItems === 0}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-red-700 hover:bg-red-800 shadow-sm hover:shadow transition-all duration-200 border border-red-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-700"
            title={totalItems === 0 ? t('pages.jobs.noJobsToDelete') : t('pages.jobs.deleteAllConfirmTitle')}
          >
            {t('pages.jobs.deleteAll')}
          </button>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm hover:shadow transition-all duration-200"
            >
              {t('pages.jobs.deleteSelected', { count: selectedIds.length })}
            </button>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
          >
            {t('common.buttons.create')}
          </button>
        </div>
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
          selectedRowIds={selectedIds}
          onSelectionChange={handleSelectionChange}
        />
      </section>
      <CreateJobModal isOpen={isCreateModalOpen} onClose={handleCreateJob} />
    </div>
  );
}
