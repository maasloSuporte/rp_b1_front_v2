import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { scheduleService } from '../../service/schedule.service';
import { priorityService } from '../../service/priority.service';
import { frequencyService } from '../../service/frequency.service';
import { useModalStore } from '../../service/modal.service';
import { useNotificationStore } from '../../service/notification.service';
import DynamicTable from '../../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type {
  IPaginationOutputDto,
  IScheduleGetAllOutputDto,
  IPriorityGetOutputDto,
  IFrequencyGetOutputDto,
} from '../../types/models';

function formatNextExecution(value: string | null | undefined): string {
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

/** Mapeia id/nome da API para chave de tradução (igual ao Schedule.tsx) */
const FREQUENCY_KEYS: Record<string, string> = {
  'Every Minute': 'everyMinute',
  'Hourly': 'hourly',
  'Daily': 'daily',
  'Weekly': 'weekly',
  'Monthly by Day': 'monthlyByDay',
  'Monthly by Week': 'monthlyByWeek',
  'Custom Cron': 'customCron',
};
const FREQUENCY_ID_TO_KEY: Record<number, string> = {
  1: 'everyMinute',
  2: 'hourly',
  3: 'daily',
  4: 'weekly',
  5: 'monthlyByDay',
  6: 'monthlyByWeek',
  7: 'customCron',
};
const PRIORITY_KEYS: Record<string, string> = {
  'Low': 'low',
  'Medium': 'medium',
  'High': 'high',
  'Critical': 'critical',
};
const PRIORITY_ID_TO_KEY: Record<number, string> = {
  1: 'low',
  2: 'medium',
  3: 'high',
  4: 'critical',
};

export default function ScheduledActivities() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState(
    'PageNumber=1&PageSize=10&SortField=nextExecution&SortOrder=asc'
  );
  const [priorities, setPriorities] = useState<IPriorityGetOutputDto[]>([]);
  const [frequencies, setFrequencies] = useState<IFrequencyGetOutputDto[]>([]);

  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('pages.scheduled.activityName'),
        filterable: true,
        sortable: true,
        filterType: 'text',
      },
      {
        key: 'frequencyName',
        label: t('pages.scheduled.frequency'),
        filterable: false,
        sortable: false,
        filterType: 'text',
      },
      {
        key: 'nextExecution',
        label: t('pages.scheduled.nextExecution'),
        filterable: false,
        sortable: true,
        filterType: 'text',
      },
      {
        key: 'priorityName',
        label: t('pages.scheduled.priority'),
        filterable: true,
        sortable: false,
        filterType: 'text',
      },
      {
        key: 'details',
        label: t('pages.scheduled.details'),
        filterable: false,
        sortable: false,
        filterType: 'text',
      },
      { key: 'actions', label: t('common.actions.label'), type: 'action' },
    ],
    [t]
  );

  const actionMenuItems: ActionMenuItem[] = useMemo(
    () => [
      { label: t('common.buttons.edit'), action: 'edit', icon: 'edit' },
      { label: t('common.buttons.delete'), action: 'delete', icon: 'trash' },
    ],
    [t]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [pri, freq] = await Promise.all([
          priorityService.getPriority(),
          frequencyService.getFrequency(),
        ]);
        setPriorities(pri ?? []);
        setFrequencies(freq ?? []);
      } catch (e) {
        console.error('Erro ao carregar prioridades/frequências:', e);
      }
    };
    load();
  }, []);

  const loadSchedule = async () => {
    try {
      const result: IPaginationOutputDto<IScheduleGetAllOutputDto> =
        await scheduleService.getAllSchedule(queryString);
      setTotalItems(result.totalItems ?? 0);
      const items = result.items ?? [];
      setData(
        items.map((x) => {
          const frequency = frequencies.find((f) => f.id === x.frequencyId);
          const priority = priorities.find((p) => p.id === Number(x.priority));
          return {
            id: x.id,
            name: x.name ?? '—',
            frequencyId: x.frequencyId,
            frequencyNameFromApi: frequency?.name ?? '—',
            nextExecution: formatNextExecution(x.nextExecution),
            nextExecutionRaw: x.nextExecution,
            priorityId: Number(x.priority),
            priorityNameFromApi: priority?.name ?? '—',
            details: x.details ?? '—',
          };
        })
      );
    } catch (error) {
      console.error('Erro ao buscar schedules:', error);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [queryString]);

  useEffect(() => {
    if (priorities.length > 0 || frequencies.length > 0) {
      loadSchedule();
    }
  }, [priorities.length, frequencies.length]);

  const displayData = useMemo(() => {
    return data.map((row: any) => {
      const freqKey = FREQUENCY_ID_TO_KEY[row.frequencyId] ?? FREQUENCY_KEYS[row.frequencyNameFromApi];
      const priKey = PRIORITY_ID_TO_KEY[row.priorityId] ?? PRIORITY_KEYS[row.priorityNameFromApi];
      return {
        ...row,
        frequencyName: freqKey ? t(`pages.schedule.frequencies.${freqKey}`) : (row.frequencyNameFromApi ?? '—'),
        priorityName: priKey ? t(`pages.schedule.priorities.${priKey}`) : (row.priorityNameFromApi ?? '—'),
      };
    });
  }, [data, t]);

  const handleActionClick = async (event: { action: string; item: any }) => {
    switch (event.action) {
      case 'edit':
        navigate(`/scheduled/${event.item.id}`);
        break;
      case 'delete': {
        const confirmed = await confirmDelete({
          itemName: event.item.name,
        });
        if (!confirmed) break;
        const id = Number(event.item.id);
        if (!Number.isFinite(id)) {
          showToast(t('common.states.error'), t('pages.scheduled.deleteError'), 'error');
          break;
        }
        try {
          await scheduleService.deleteSchedule({ id });
          showToast(
            t('common.states.success'),
            t('pages.scheduled.deleteSuccess'),
            'success'
          );
          loadSchedule();
        } catch (error: any) {
          const data = error.response?.data;
          const isDbError =
            data?.exception === 'DbUpdateException' || error.response?.status === 500;
          const message = isDbError
            ? t('pages.scheduled.deleteErrorDb')
            : (data?.message ?? data?.title ?? error.message ?? t('pages.scheduled.deleteError'));
          showToast(t('common.states.error'), message, 'error');
          console.error('Erro ao excluir agendamento:', data ?? error);
        }
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">
          {t('pages.scheduled.title')}
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          {t('pages.scheduled.subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <p className="text-sm text-text-secondary">
          {t('pages.scheduled.activitiesCount')} ({totalItems})
        </p>
        <button
          onClick={() => navigate('/scheduled/create')}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
        >
          {t('pages.scheduled.createSchedule')}
        </button>
      </div>

      <section className="mt-4">
        <DynamicTable
          columns={columns}
          data={displayData}
          totalItems={totalItems}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 100]}
          showFirstLastButtons={true}
          initialSortField="nextExecution"
          initialSortOrder="asc"
          actionMenuItems={actionMenuItems}
          onActionClick={handleActionClick}
          onQueryParamsChange={setQueryString}
        />
      </section>
    </div>
  );
}
