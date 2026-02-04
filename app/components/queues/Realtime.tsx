import { useEffect, useState } from 'react';
import { queuesService } from '../../service/queues.service';
import DynamicTable from '../DynamicTable';
import Loading from '../Loading';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { IPaginationOutputDto, IQueueGetOutputDto } from '../../types/models';

export default function Realtime() {
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('');
  const [loading, setLoading] = useState(true);

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Name',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'items',
      label: 'Items',
      filterable: false,
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
      label: 'View',
      action: 'view',
      icon: 'eye'
    }
  ];

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
    return <Loading text="Carregando queues em tempo real..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary mb-8">Real Time Queues</h2>
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
