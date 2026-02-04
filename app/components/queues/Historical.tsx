import { useEffect, useState } from 'react';
import { queuesService } from '../../service/queues.service';
import DynamicTable from '../DynamicTable';
import Loading from '../Loading';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { IPaginationOutputDto, IQueueGetOutputDto } from '../../types/models';

export default function Historical() {
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
      key: 'processedItems',
      label: 'Processed Items',
      filterable: false,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'lastProcessed',
      label: 'Last Processed',
      filterable: false,
      sortable: true,
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
      label: 'View Details',
      action: 'view',
      icon: 'eye'
    }
  ];

  useEffect(() => {
    loadHistoricalQueues();
  }, [queryString]);

  const loadHistoricalQueues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(queryString);
      const pageNumber = parseInt(params.get('pageNumber') || '1');
      const pageSize = parseInt(params.get('pageSize') || '10');

      const result: IPaginationOutputDto<IQueueGetOutputDto> = 
        await queuesService.getAllQueues({ pageNumber, pageSize });

      const data = result || [];
      setTotalItems(data?.totalItems || 0);
      setData((data?.items || []).map((x: IQueueGetOutputDto) => ({
        id: x.id,
        name: x.name || '-',
        processedItems: (x as any).processedItems || 0,
        lastProcessed: (x as any).lastProcessed ? new Date((x as any).lastProcessed).toLocaleString() : '-',
      })));
    } catch (error) {
      console.error('Erro ao carregar histórico de queues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'view':
        // TODO: Implementar visualização de detalhes históricos
        console.log('View historical queue:', event.item);
        break;
    }
  };

  if (loading) {
    return <Loading text="Carregando histórico de queues..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary mb-8">Historical Queues</h2>
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
