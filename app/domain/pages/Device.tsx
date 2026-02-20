import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { devicesService } from '../../service/devices.service';
import { useModalStore } from '../../service/modal.service';
import { useNotificationStore } from '../../service/notification.service';
import DynamicTable from '../../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { IPaginationOutputDto, IDevicesGetOutputDto } from '../../types/models';

export default function Device() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('PageNumber=1&PageSize=5&SortField=id&SortOrder=asc');

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'machineName', label: t('pages.assets.name'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'environment', label: t('pages.machines.environment'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'hostName', label: t('pages.machines.hostname'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'ip', label: t('pages.machines.ip'), filterable: true, sortable: false, filterType: 'text' },
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
      case 'delete': {
        const confirmed = await confirmDelete({
          itemName: event.item.machineName ?? event.item.hostName ?? `#${event.item.id}`,
        });
        if (!confirmed) break;
        const id = Number(event.item.id);
        if (!Number.isFinite(id)) {
          showToast(t('common.states.error'), t('pages.machines.deleteError'), 'error');
          break;
        }
        try {
          await devicesService.deleteDevice({ id });
          showToast(t('common.states.success'), t('pages.machines.deleteSuccess'), 'success');
          loadDevices();
        } catch (error: any) {
          const data = error.response?.data;
          const isDbError = data?.exception === 'DbUpdateException' || error.response?.status === 500;
          const message = isDbError
            ? t('pages.machines.deleteErrorDb')
            : (data?.message ?? data?.title ?? error.message ?? t('pages.machines.deleteError'));
          showToast(t('common.states.error'), message, 'error');
          console.error('Erro ao excluir máquina:', data ?? error);
        }
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">{t('pages.machines.title')}</h1>
        <button
          onClick={() => navigate('/machine/create')}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
        >
          {t('pages.machines.createMachineTemplate')}
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
