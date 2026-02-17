import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { assetsService } from '../../service/assets.service';
import { useModalStore } from '../../service/modal.service';
import { useNotificationStore } from '../../service/notification.service';
import DynamicTable from '../../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { IAssetGetAllOutputDto, IPaginationOutputDto } from '../../types/models';

export default function AssetsManagement() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('PageNumber=1&PageSize=5&SortField=id&SortOrder=asc');
  const [typeFilterOptions, setTypeFilterOptions] = useState<{ id: string; label: string }[]>([]);

  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: 'name',
        sortKey: 'name',
        label: t('pages.assets.name'),
        filterable: true,
        sortable: false,
        filterType: 'text',
      },
      {
        key: 'type',
        label: t('pages.assets.type'),
        filterable: true,
        sortable: false,
        filterType: 'select',
        selectMode: 'multiple',
        filterOptions: typeFilterOptions,
      },
      {
        key: 'description',
        label: t('pages.assets.description'),
        filterable: false,
        sortable: false,
      },
      {
        key: 'actions',
        label: t('pages.assets.actions'),
        type: 'action',
      },
    ],
    [t, typeFilterOptions]
  );

  const actionMenuItems: ActionMenuItem[] = useMemo(
    () => [
      { label: t('pages.assets.edit'), action: 'edit', icon: 'edit' },
      { label: t('pages.assets.deleted'), action: 'deleted', icon: 'block' },
    ],
    [t]
  );

  useEffect(() => {
    loadAssets();
  }, [queryString]);

  const loadAssets = async () => {
    try {
      const result: IPaginationOutputDto<IAssetGetAllOutputDto> =
        await assetsService.getAllAssets(queryString);
      setTotalItems(result.totalItems);
      const mappedData = result.items.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        description: item.description,
      }));
      setData(mappedData);
      setTypeFilterOptions(
        Array.from(new Set(mappedData.map((asset) => asset.type))).map((typeValue) => ({
          id: typeValue,
          label: typeValue,
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar assets:', error);
    }
  };

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'edit':
        navigate(`/assets/${event.item.id}`);
        break;
      case 'deleted':
        const confirmed = await confirmDelete({
          itemName: event.item.name
        });
        if (confirmed) {
          try {
            await assetsService.deleteAsset({ id: event.item.id });
            showToast(t('common.states.success'), t('pages.assets.deleteSuccess'), 'success');
            loadAssets();
          } catch (error) {
            showToast(t('common.states.error'), t('pages.assets.deleteError'), 'error');
          }
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">{t('pages.assets.title')}</h1>
        <button
          onClick={() => navigate('/assets/create')}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
        >
          {t('pages.assets.createAsset')}
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
