import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/job.service';
import { useNotificationStore } from '../services/notification.service';
import DynamicTable from '../components/DynamicTable';
import CreateJobModal from '../components/modals/CreateJobModal';
import type { TableColumn, ActionMenuItem } from '../types/table';
import type { IPaginationOutputDto, IJobGetAllOutputDto } from '../types/models';

export default function Jobs() {
  const navigate = useNavigate();
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const columns: TableColumn[] = [
    {
      key: 'Name',
      label: 'Name',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'HostName',
      label: 'HostName',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'ProjectName',
      label: 'ProjectName',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'MachineUser',
      label: 'Machine User',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'State',
      label: 'State',
      filterable: false,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'Priority',
      label: 'Priority',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'PackageVersion',
      label: 'Robot Version',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'StartedAt',
      label: 'StartedAt',
      filterable: false,
      sortable: true,
      filterType: 'text',
    },
    {
      key: 'EndedAt',
      label: 'EndedAt',
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
      label: 'Preview',
      action: 'preview',
      icon: 'preview'
    },
    {
      label: 'Execute',
      action: 'execute',
      icon: 'play'
    }
  ];

  useEffect(() => {
    loadJobs();
  }, [queryString]);

  const loadJobs = async () => {
    try {
      const result: IPaginationOutputDto<IJobGetAllOutputDto> = 
        await jobService.getAllJobs(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map(x => ({
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
    }
  };

  const handleExecuteJob = async (jobId: number) => {
    try {
      await jobService.executeJob(jobId);
      showToast('Success', 'Job executed successfully', 'success');
      loadJobs();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to execute job';
      showToast('Error', message, 'error');
    }
  };

  const handleCreateJob = async (jobData: { name: string; projectId: number; priorityId: number; machineId: number } | null) => {
    if (!jobData) {
      setIsCreateModalOpen(false);
      return;
    }

    try {
      await jobService.createJob(jobData);
      showToast('Success', 'Job created successfully', 'success');
      setIsCreateModalOpen(false);
      loadJobs();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create job';
      showToast('Error', message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-text-primary">Jobs</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <span>Create</span>
        </button>
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
      <CreateJobModal isOpen={isCreateModalOpen} onClose={handleCreateJob} />
    </div>
  );
}
