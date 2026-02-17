import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { projectsService } from '../../service/projects.service';
import { priorityService } from '../../service/priority.service';
import { devicesService } from '../../service/devices.service';
import { jobService } from '../../service/job.service';
import { useNotificationStore } from '../../service/notification.service';
import type {
  IProjectGetSimpleOutputDto,
  IPriorityGetOutputDto,
  IDeviceGetAllOutputDto,
} from '../../types/models';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ParameterRow {
  name: string;
  type: string;
  value: string;
}

export default function Execution() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const showToast = useNotificationStore((state) => state.showToast);

  const [projects, setProjects] = useState<IProjectGetSimpleOutputDto[]>([]);
  const [priorities, setPriorities] = useState<IPriorityGetOutputDto[]>([]);
  const [machines, setMachines] = useState<IDeviceGetAllOutputDto[]>([]);

  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [selectedMachine, setSelectedMachine] = useState<number>(0);
  const [selectedPriority, setSelectedPriority] = useState<number>(0);
  const [jobName, setJobName] = useState('');
  const [parameterRows, setParameterRows] = useState<ParameterRow[]>([
    { name: '', type: '', value: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
      showToast(t('common.states.error'), t('pages.execution.executeError'), 'error');
    }
  };

  const addLine = () => {
    setParameterRows([...parameterRows, { name: '', type: '', value: '' }]);
  };

  const removeLine = (index: number) => {
    if (parameterRows.length > 1) {
      setParameterRows(parameterRows.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index: number, field: keyof ParameterRow, value: string) => {
    const newRows = [...parameterRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setParameterRows(newRows);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProject === 0 || selectedMachine === 0 || selectedPriority === 0) {
      showToast(t('common.states.error'), t('pages.execution.executeError'), 'error');
      return;
    }

    const name = jobName.trim() || `Execution-${Date.now()}`;
    setIsSubmitting(true);

    try {
      const created = await jobService.createJob({
        name,
        projectId: selectedProject,
        priorityId: selectedPriority,
        machineId: selectedMachine,
      });

      await jobService.executeJob(created.id);
      showToast(t('common.states.success'), t('pages.execution.executeSuccess'), 'success');
      navigate('/jobs');
    } catch (error: any) {
      const message = error.response?.data?.message || t('pages.execution.executeError');
      showToast(t('common.states.error'), message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-6">
        <button
          onClick={() => navigate('/automation')}
          className="text-primary hover:text-primary/80 mb-4 flex items-center gap-2"
        >
          ← {t('pages.execution.backToAutomation')}
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">{t('pages.execution.title')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-card p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('pages.execution.jobName')}
          </label>
          <input
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            placeholder={t('pages.execution.jobNamePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('pages.execution.selectProject')} <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value={0}>{t('pages.execution.selectProject')}</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('pages.execution.selectMachine')} <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value={0}>{t('pages.execution.selectMachine')}</option>
            {machines.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.machineName}
              </option>
            ))}
          </select>
          {machines.length === 0 && (
            <p className="mt-1 text-sm text-amber-600">
              Nenhuma máquina registrada. O agent precisa estar instalado e conectado na máquina para aparecer aqui.
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('pages.execution.selectPriority')} <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value={0}>{t('pages.execution.selectPriority')}</option>
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {t('pages.execution.parameters')} <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <button
              type="button"
              onClick={addLine}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <PlusIcon className="w-5 h-5" />
              {t('pages.execution.addParameter')}
            </button>
          </div>

          <div className="space-y-3">
            {parameterRows.map((row, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder={t('pages.execution.namePlaceholder')}
                    value={row.name}
                    onChange={(e) => updateRow(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="col-span-3">
                  <select
                    value={row.type}
                    onChange={(e) => updateRow(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t('pages.execution.selectType')}</option>
                    <option value="string">{t('pages.execution.typeString')}</option>
                    <option value="number">{t('pages.execution.typeNumber')}</option>
                    <option value="boolean">{t('pages.execution.typeBoolean')}</option>
                  </select>
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder={t('pages.execution.valuePlaceholder')}
                    value={row.value}
                    onChange={(e) => updateRow(index, 'value', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="col-span-1">
                  {parameterRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/automation')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {t('common.buttons.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '...' : t('pages.execution.execute')}
          </button>
        </div>
      </form>
    </div>
  );
}
