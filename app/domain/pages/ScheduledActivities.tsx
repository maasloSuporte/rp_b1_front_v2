import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { scheduleService } from '../../service/schedule.service';
import { useModalStore } from '../../service/modal.service';
import { useNotificationStore } from '../../service/notification.service';
import DynamicTable from '../../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { IPaginationOutputDto, IScheduleGetAllOutputDto } from '../../types/models';

export default function ScheduledActivities() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('PageNumber=1&PageSize=5&SortField=id&SortOrder=asc');

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'Name', label: t('pages.assets.name'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'Priority', label: t('pages.schedule.priority'), filterable: false, sortable: false, filterType: 'text' },
      { key: 'NextExecution', label: t('pages.scheduled.nextExecution'), filterable: false, sortable: true, filterType: 'text' },
      { key: 'actions', label: t('common.actions.label'), type: 'action' },
    ],
    [t]
  );

  const actionMenuItems: ActionMenuItem[] = useMemo(
    () => [
      { label: t('common.buttons.edit'), action: 'edit', icon: 'edit' },
      { label: t('pages.assets.deleted'), action: 'deleted', icon: 'deleted' },
    ],
    [t]
  );

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
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">{t('pages.scheduled.title')}</h1>
        <button
          onClick={() => navigate('/scheduled/create')}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
        >
          {t('pages.scheduled.createSchedule')}
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
