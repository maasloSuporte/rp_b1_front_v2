import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { packagesService } from '../services/packages.service';
import { packagesVersionsService } from '../services/packagesVersions.service';
import { fileDownloadService } from '../services/fileDownload.service';
import { useModalStore } from '../services/modal.service';
import { useNotificationStore } from '../services/notification.service';
import DynamicTable from '../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../types/table';
import type { IPaginationOutputDto, IPackageGetOutputDto } from '../types/models';

export default function Packages() {
  const navigate = useNavigate();
  const confirmDownload = useModalStore((state) => state.confirmDownload);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const columns: TableColumn[] = [
    {
      key: 'Name',
      label: 'Name',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'Description',
      label: 'Description',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'PackageVersion',
      label: 'PackageVersion',
      filterable: true,
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
      label: 'Download',
      action: 'download',
      icon: 'download'
    }
  ];

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
      <h1 className="text-4xl font-semibold text-text-primary mb-6">Packages</h1>
      
      <div className="mb-6 flex justify-end">
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Upload
            <span className={`transform transition-transform ${showOptions ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => {
                  handleUpload(true);
                  setShowOptions(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-md"
              >
                New
              </button>
              <button
                onClick={() => {
                  handleUpload(false);
                  setShowOptions(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-md"
              >
                Upgrade
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="bg-white rounded-lg shadow-card p-4">
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
