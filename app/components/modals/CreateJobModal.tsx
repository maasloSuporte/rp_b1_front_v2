import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlayIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { projectsService } from '../../service/projects.service';
import { priorityService } from '../../service/priority.service';
import { devicesService } from '../../service/devices.service';
import type {
  IProjectGetSimpleOutputDto,
  IPriorityGetOutputDto,
  IDeviceGetAllOutputDto,
} from '../../types/models';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: (result: { name: string; projectId: number; priorityId: number; machineId: number } | null) => void;
}

interface JobFormData {
  name: string;
  projectId: number;
  priorityId: number;
  machineId: number;
}

export default function CreateJobModal({ isOpen, onClose }: CreateJobModalProps) {
  const [projects, setProjects] = useState<IProjectGetSimpleOutputDto[]>([]);
  const [priorities, setPriorities] = useState<IPriorityGetOutputDto[]>([]);
  const [machines, setMachines] = useState<IDeviceGetAllOutputDto[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobFormData>({
    defaultValues: {
      name: '',
      projectId: 0,
      priorityId: 0,
      machineId: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
      reset();
    }
  }, [isOpen, reset]);

  const loadData = async () => {
    try {
      const [projectsData, prioritiesData, machinesData] = await Promise.all([
        projectsService.getProjects(),
        priorityService.getPriority(),
        devicesService.getDevices(),
      ]);
      setProjects(projectsData);
      setPriorities(prioritiesData);
      setMachines(machinesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const onSubmit = async (data: JobFormData) => {
    if (data.projectId === 0 || data.priorityId === 0 || data.machineId === 0) {
      return;
    }
    setLoading(true);
    try {
      onClose({
        name: data.name,
        projectId: data.projectId,
        priorityId: data.priorityId,
        machineId: data.machineId,
      });
    } catch (error) {
      console.error('Erro ao criar job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => onClose(null)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col items-center text-center mb-4">
                    <PlayIcon className="h-12 w-12 text-primary mb-3" />
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                      Create Job
                    </Dialog.Title>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter job name"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('projectId', {
                          required: 'Project is required',
                          min: { value: 1, message: 'Project is required' },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={0}>Select a project...</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                      {errors.projectId && (
                        <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('priorityId', {
                          required: 'Priority is required',
                          min: { value: 1, message: 'Priority is required' },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={0}>Select a priority...</option>
                        {priorities.map((priority) => (
                          <option key={priority.id} value={priority.id}>
                            {priority.name}
                          </option>
                        ))}
                      </select>
                      {errors.priorityId && (
                        <p className="mt-1 text-sm text-red-600">{errors.priorityId.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Machine <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('machineId', {
                          required: 'Machine is required',
                          min: { value: 1, message: 'Machine is required' },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={0}>Select a machine...</option>
                        {machines.map((machine) => (
                          <option key={machine.id} value={machine.id}>
                            {machine.machineName}
                          </option>
                        ))}
                      </select>
                      {errors.machineId && (
                        <p className="mt-1 text-sm text-red-600">{errors.machineId.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => onClose(null)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
