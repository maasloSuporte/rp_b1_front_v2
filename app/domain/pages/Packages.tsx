import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { packagesService } from '../../service/packages.service';
import { packagesVersionsService } from '../../service/packagesVersions.service';
import { fileDownloadService } from '../../service/fileDownload.service';
import { useModalStore } from '../../service/modal.service';
import { useNotificationStore } from '../../service/notification.service';
import DynamicTable from '../../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../../types/table';
import type { IPaginationOutputDto, IPackageGetOutputDto } from '../../types/models';

export default function Packages() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const confirmDownload = useModalStore((state) => state.confirmDownload);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('PageNumber=1&PageSize=5&SortField=id&SortOrder=asc');
  const [showOptions, setShowOptions] = useState(false);

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'Name', label: t('pages.assets.name'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'Description', label: t('pages.assets.description'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'PackageVersion', label: t('pages.automation.columnPackageVersion'), filterable: true, sortable: false, filterType: 'text' },
      { key: 'actions', label: t('common.actions.label'), type: 'action' },
    ],
    [t]
  );

  const actionMenuItems: ActionMenuItem[] = useMemo(
    () => [{ label: t('pages.packages.download'), action: 'download', icon: 'download' }],
    [t]
  );

  useEffect(() => {
    loadPackages();
  }, [queryString]);

  const loadPackages = async () => {
    try {
      const result: IPaginationOutputDto<IPackageGetOutputDto> = 
        await packagesService.getAllPackages(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map(x => ({
        id: x.id,
        Name: x.name,
        Description: x.description,
        PackageVersion: x.packageVersions?.map(v => v.version).join(', ') ?? '',
        rawPackageVersions: x.packageVersions ?? []
      })));
    } catch (error) {
      console.error('Erro ao carregar packages:', error);
    }
  };

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'download':
        await handleDownload(event.item);
        break;
    }
  };

  const handleDownload = async (packageItem: any) => {
    const selectedVersion = await confirmDownload({
      title: `Download - ${packageItem.Name}`,
      versions: packageItem.rawPackageVersions.map((v: any) => ({
        id: v.id,
        version: v.version
      }))
    });

    if (selectedVersion) {
      try {
        const blob = await packagesVersionsService.getDownloadPackage(selectedVersion.id);
        const fileName = `v${selectedVersion.version}-${packageItem.Name}.zip`;
        fileDownloadService.downloadBlobFile(blob, fileName);
        showToast('Success', 'Download completed successfully', 'success');
      } catch (error) {
        showToast('Error', 'Failed to download package', 'error');
      }
    }
  };

  const handleUpload = (isNew: boolean) => {
    navigate('/packages/upload', { state: { isNew } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary">{t('pages.packages.title')}</h1>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200"
          >
            {t('pages.packages.upload')}
            <span className={`ml-1 transform transition-transform ${showOptions ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-card border border-border z-10 min-w-[120px] py-1">
              <button
                onClick={() => {
                  handleUpload(true);
                  setShowOptions(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-text-primary hover:bg-gray-50 rounded-t-xl transition-colors"
              >
                {t('pages.packages.new')}
              </button>
              <button
                onClick={() => {
                  handleUpload(false);
                  setShowOptions(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-text-primary hover:bg-gray-50 rounded-b-xl transition-colors"
              >
                {t('pages.packages.upgrade')}
              </button>
            </div>
          )}
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
        />
      </section>
    </div>
  );
}
