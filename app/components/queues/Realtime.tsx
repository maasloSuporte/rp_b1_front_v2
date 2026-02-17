import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { queuesService } from '../../service/queues.service';
import DynamicTable from '../DynamicTable';
import Loading from '../Loading';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { IPaginationOutputDto, IQueueGetOutputDto } from '../../types/models';

export default function Realtime() {
  const { t } = useTranslation('translation');
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('');
  const [loading, setLoading] = useState(true);

  const columns: TableColumn[] = useMemo(() => [
    { key: 'name', label: t('pages.queues.name'), filterable: true, sortable: false, filterType: 'text' },
    { key: 'status', label: t('pages.queues.status'), filterable: true, sortable: false, filterType: 'text' },
    { key: 'items', label: t('pages.queues.items'), filterable: false, sortable: false, filterType: 'text' },
    { key: 'actions', label: t('pages.queues.actions'), type: 'action' },
  ], [t]);

  const actionMenuItems: ActionMenuItem[] = useMemo(() => [
    { label: t('pages.queues.view'), action: 'view', icon: 'eye' },
  ], [t]);

  useEffect(() => {
    loadQueues();
  }, [queryString]);

  const loadQueues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(queryString);
      const pageNumber = parseInt(params.get('pageNumber') || '1');
      const pageSize = parseInt(params.get('pageSize') || '10');

      const result: IPaginationOutputDto<IQueueGetOutputDto> = 
        await queuesService.getAllQueues({ pageNumber, pageSize });
      setTotalItems(result?.totalItems || 0);
      setData((result?.items || []).map((x: IQueueGetOutputDto) => ({
        id: x.id,
        name: x.name || '-',
        items: (x as any).itemsCount || 0,
      })));
    } catch (error) {
      console.error('Erro ao carregar queues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'view':
        // TODO: Implementar visualização de detalhes
        console.log('View queue:', event.item);
        break;
    }
  };

  if (loading) {
    return <Loading text={t('pages.queues.loadingRealtime')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary mb-8">{t('pages.queues.titleRealtime')}</h2>
      <section className="mt-6">
      <DynamicTable
        columns={columns}
        data={data}
        totalItems={totalItems}
        pageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        showFirstLastButtons={true}
        actionMenuItems={actionMenuItems}
        onActionClick={handleActionClick}
        onQueryParamsChange={setQueryString}
      />
      </section>
    </div>
  );
}
