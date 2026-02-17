import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { scheduleService } from '../../service/schedule.service';
import { frequencyService } from '../../service/frequency.service';
import { priorityService } from '../../service/priority.service';
import { projectsService } from '../../service/projects.service';
import { devicesService } from '../../service/devices.service';
import { useNotificationStore } from '../../service/notification.service';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { FormInput, FormSelect, FormTextarea, FormButton } from '../../components/ui';
import type {
  IScheduleCreateInputDto,
  IScheduleUpdateInputDto,
  IFrequencyGetOutputDto,
  IPriorityGetOutputDto,
  IProjectGetSimpleOutputDto,
  IDeviceGetAllOutputDto,
  ICronInputDto,
} from '../../types/models';

interface ScheduleFormData {
  frequencyId: number;
  name: string;
  projectId: number;
  machineId: number;
  priority: number;
  details: string;
  cronSchedulling: {
    timeZone: string;
    minute: { every: string };
    hourly: { every: string; minute: string };
    daily: { every: string; hour: string; minute: string };
    weekly: { every: string; dayOfWeek: string[] };
    monthlyDay: { every: string; dayOfMonth: string; hour: string; minute: string };
    monthlyWeek: { every: string; weekOfMonth: string; dayOfWeek: string; hour: string; minute: string };
  };
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fieldInputClass =
  'w-full min-h-[2.75rem] px-4 py-3 text-base text-text-primary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200';
const fieldSelectClass =
  'w-full min-h-[2.75rem] px-4 py-3 text-base text-text-primary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200';

export default function Schedule() {
  const { t } = useTranslation('translation');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
  const [frequencies, setFrequencies] = useState<IFrequencyGetOutputDto[]>([]);
  const [projects, setProjects] = useState<IProjectGetSimpleOutputDto[]>([]);
  const [machines, setMachines] = useState<IDeviceGetAllOutputDto[]>([]);
  const [priorities, setPriorities] = useState<IPriorityGetOutputDto[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<ScheduleFormData>({
    mode: 'onChange',
    defaultValues: {
      frequencyId: 0,
      name: '',
      projectId: 0,
      machineId: 0,
      priority: 0,
      details: '',
      cronSchedulling: {
        timeZone: 'E. South America Standard Time',
        minute: { every: '' },
        hourly: { every: '', minute: '' },
        daily: { every: '', hour: '', minute: '' },
        weekly: { every: '', dayOfWeek: [] },
        monthlyDay: { every: '', dayOfMonth: '', hour: '', minute: '' },
        monthlyWeek: { every: '', weekOfMonth: '', dayOfWeek: '', hour: '', minute: '' },
      },
    },
  });

  const frequencyId = watch('frequencyId');

  useEffect(() => {
    loadFrequencies();
    loadProjects();
    loadDevices();
    loadPriorities();
    if (isEditMode && id) {
      loadScheduleById(Number(id));
    }
  }, [id, isEditMode]);

  const loadFrequencies = async () => {
    try {
      const result = await frequencyService.getFrequency();
      setFrequencies(result);
    } catch (error) {
      console.error('Erro ao carregar frequências:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const result = await projectsService.getProjects();
      setProjects(result);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const loadDevices = async () => {
    try {
      const result = await devicesService.getDevices();
      setMachines(result);
    } catch (error) {
      console.error('Erro ao carregar máquinas:', error);
    }
  };

  const loadPriorities = async () => {
    try {
      const result = await priorityService.getPriority();
      setPriorities(result);
    } catch (error) {
      console.error('Erro ao carregar prioridades:', error);
    }
  };

  const loadScheduleById = async (scheduleId: number) => {
    try {
      const schedule = await scheduleService.getByIdSchedule(scheduleId);
      setValue('name', schedule.name);
      setValue('details', schedule.details);
      setValue('frequencyId', schedule.frequencyId);
      setValue('projectId', schedule.projectId);
      setValue('machineId', schedule.machineId);
      setValue('priority', schedule.priorityId);

      const cron = schedule.schedule;
      if (cron) {
        setValue('cronSchedulling.timeZone', cron.timeZone ?? 'E. South America Standard Time');
        setValue('cronSchedulling.minute.every', cron.every ?? '');
        setValue('cronSchedulling.hourly.every', cron.every ?? '');
        setValue('cronSchedulling.hourly.minute', cron.minute ?? '');
        setValue('cronSchedulling.daily.every', cron.every ?? '');
        setValue('cronSchedulling.daily.hour', cron.hour ?? '');
        setValue('cronSchedulling.daily.minute', cron.minute ?? '');
        setValue('cronSchedulling.weekly.every', cron.every ?? '');
        setValue('cronSchedulling.weekly.dayOfWeek', Array.isArray(cron.dayOfWeek) ? cron.dayOfWeek : []);
        setValue('cronSchedulling.monthlyDay.every', cron.every ?? '');
        setValue('cronSchedulling.monthlyDay.dayOfMonth', '');
        setValue('cronSchedulling.monthlyDay.hour', cron.hour ?? '');
        setValue('cronSchedulling.monthlyDay.minute', cron.minute ?? '');
        setValue('cronSchedulling.monthlyWeek.every', cron.every ?? '');
        setValue('cronSchedulling.monthlyWeek.weekOfMonth', cron.weekOfMonth ?? '');
        setValue('cronSchedulling.monthlyWeek.dayOfWeek', Array.isArray(cron.dayOfWeek) ? cron.dayOfWeek[0] ?? '' : '');
        setValue('cronSchedulling.monthlyWeek.hour', cron.hour ?? '');
        setValue('cronSchedulling.monthlyWeek.minute', cron.minute ?? '');
      }
    } catch (error) {
      console.error('Erro ao carregar schedule:', error);
      showToast('Error', 'Falha ao carregar dados do schedule', 'error');
    }
  };

  const buildCronSchedulling = (frequencyId: number, cron: ScheduleFormData['cronSchedulling']):ICronInputDto => {
    const baseCron: ICronInputDto = {
      timeZone: cron.timeZone,
      minute: {every:''},
      hourly: { every: '', minute: '' },
      daily: { every: '', hour: '', minute: '' },
      weekly: { every: '', dayOfWeek: [] },
      monthlyDay: { every: '', dayOfMonth: '', hour: '', minute: '' },
      monthlyWeek: { every: '', weekOfMonth: '', dayOfWeek: [], hour: '', minute: '' },
      cron: ''
    }

    const cronSchedulling: Record<number, ICronInputDto> = {
      [1]:{
        ...baseCron,
        minute: {every: String(cron.minute.every || '')},
        hourly: { every: '', minute: '' },
        daily: { every: '', hour: '', minute: '' },
        weekly: { every: '', dayOfWeek: [] },
        monthlyDay: { every: '', dayOfMonth: '', hour: '', minute: '' },
        monthlyWeek: { every: '', weekOfMonth: '', dayOfWeek: [], hour: '', minute: '' },
      },
      [2]:{
        ...baseCron,
        minute: {every: ''},
        hourly: { 
          every: String(cron.hourly.every || ''), 
          minute: String(cron.hourly.minute || '') 
        },
        daily: { every: '', hour: '', minute: '' },
        weekly: { every: '', dayOfWeek: [] },
        monthlyDay: { every: '', dayOfMonth: '', hour: '', minute: '' },
        monthlyWeek: { every: '', weekOfMonth: '', dayOfWeek: [], hour: '', minute: '' },
      },
      [3]:{
        ...baseCron,
        minute: {every: ''},
        hourly: { every: '', minute: '' },
        daily: {
          every: String(cron.daily.every),
          hour: String(cron.daily.hour),
          minute: String(cron.daily.minute),
        },
        weekly: { every: '', dayOfWeek: [] },
        monthlyDay: { every: '', dayOfMonth: '', hour: '', minute: '' },
        monthlyWeek: { every: '', weekOfMonth: '', dayOfWeek: [], hour: '', minute: '' },
      },
      [4]:{
        ...baseCron,
        minute: {every: ''},
        hourly: { every: '', minute: '' },
        daily: { every: '', hour: '', minute: '' },
        weekly: { every: String(cron.weekly.every), dayOfWeek: cron.weekly.dayOfWeek || [] },
        monthlyDay: { every: '', dayOfMonth: '', hour: '', minute: '' },
        monthlyWeek: { every: '', weekOfMonth: '', dayOfWeek: [], hour: '', minute: '' },
      },
      [5]:{
        ...baseCron,
        minute: {every: ''},
        hourly: { every: '', minute: '' },
        daily: { every: '', hour: '', minute: '' },
        weekly: { every: '', dayOfWeek: [] },
        monthlyDay: {
          every: String(cron.monthlyDay.every),
          dayOfMonth: String(cron.monthlyDay.dayOfMonth),
          hour: String(cron.monthlyDay.hour),
          minute: String(cron.monthlyDay.minute),
        },
        monthlyWeek: { every: '', weekOfMonth: '', dayOfWeek: [], hour: '', minute: '' },
      },
      [6]:{
        ...baseCron,
        minute: {every: ''},
        hourly: { every: '', minute: '' },
        daily: { every: '', hour: '', minute: '' },
        weekly: { every: '', dayOfWeek: [] },
        monthlyDay: { every: '', dayOfMonth: '', hour: '', minute: '' },
        monthlyWeek: {
          every: String(cron.monthlyWeek.every),
          weekOfMonth: String(cron.monthlyWeek.weekOfMonth),
          dayOfWeek: [cron.monthlyWeek.dayOfWeek],
          hour: String(cron.monthlyWeek.hour),
          minute: String(cron.monthlyWeek.minute),
        },
      },
    }
    
    return cronSchedulling[frequencyId] || baseCron;

  };

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      // Se o react-hook-form validou, os campos devem estar corretos
      // Apenas uma validação final de segurança
      const frequencyIdNum = Number(data.frequencyId);
      if (frequencyIdNum === 2) {
        const everyValue = data.cronSchedulling.hourly.every;
        const minuteValue = data.cronSchedulling.hourly.minute;
        
        // Se os valores estão vazios, o react-hook-form não deveria ter permitido o submit
        // Mas vamos fazer uma verificação final
        if (!everyValue || everyValue === '' || Number(everyValue) <= 0) {
          showToast('Error', 'Para frequência Hourly, o campo "Repeat every" é obrigatório e deve ser maior que 0', 'error');
          return;
        }
        if (minuteValue === null || minuteValue === undefined || minuteValue === '' || Number(minuteValue) < 0 || Number(minuteValue) > 59) {
          showToast('Error', 'Para frequência Hourly, o campo "Minute" é obrigatório e deve ser entre 0 e 59', 'error');
          return;
        }
      } else if (frequencyIdNum === 1) {
        // Minute - every é obrigatório
        if (!data.cronSchedulling.minute.every) {
          showToast('Error', 'Para frequência Minute, o campo "Every" é obrigatório', 'error');
          return;
        }
      } else if (frequencyIdNum === 3) {
        // Daily - every, hour e minute são obrigatórios
        if (!data.cronSchedulling.daily.every || !data.cronSchedulling.daily.hour || !data.cronSchedulling.daily.minute) {
          showToast('Error', 'Para frequência Daily, os campos "Repeat every", "Hour" e "Minute" são obrigatórios', 'error');
          return;
        }
      } else if (frequencyIdNum === 4) {
        // Weekly - every e dayOfWeek são obrigatórios
        if (!data.cronSchedulling.weekly.every || !data.cronSchedulling.weekly.dayOfWeek || data.cronSchedulling.weekly.dayOfWeek.length === 0) {
          showToast('Error', 'Para frequência Weekly, os campos "Repeat every" e "Day of Week" são obrigatórios', 'error');
          return;
        }
      } else if (frequencyIdNum === 5) {
        // MonthlyDay - todos os campos são obrigatórios
        if (!data.cronSchedulling.monthlyDay.every || !data.cronSchedulling.monthlyDay.dayOfMonth || !data.cronSchedulling.monthlyDay.hour || !data.cronSchedulling.monthlyDay.minute) {
          showToast('Error', 'Para frequência Monthly Day, todos os campos são obrigatórios', 'error');
          return;
        }
      } else if (frequencyIdNum === 6) {
        // MonthlyWeek - todos os campos são obrigatórios
        if (!data.cronSchedulling.monthlyWeek.every || !data.cronSchedulling.monthlyWeek.weekOfMonth || !data.cronSchedulling.monthlyWeek.dayOfWeek || !data.cronSchedulling.monthlyWeek.hour || !data.cronSchedulling.monthlyWeek.minute) {
          showToast('Error', 'Para frequência Monthly Week, todos os campos são obrigatórios', 'error');
          return;
        }
      }

      if (isEditMode && id) {
        const updateInput: IScheduleUpdateInputDto = {
          frequencyId: data.frequencyId,
          name: data.name.trim(),
          priority: data.priority,
          details: data.details.trim(),
          projectId: data.projectId,
          machineId: data.machineId,
        };
        await scheduleService.updateSchedule(Number(id), updateInput);
        showToast(t('common.states.success'), t('pages.schedule.updatedSuccess'), 'success');
        navigate('/scheduled');
      } else {
        const createInput: IScheduleCreateInputDto = {
          frequencyId: Number(data.frequencyId),
          name: data.name,
          projectId: Number(data.projectId),
          machineId: Number(data.machineId),
          priority: Number(data.priority),
          details: data.details,
          arguments: [
            {
              name: 'default',
              key: 'default',
              value: 'default',
              order: 1,
            },
          ],
          cronSchedulling: buildCronSchedulling(Number(data.frequencyId), data.cronSchedulling),
        };

        await scheduleService.createSchedule(createInput);
        showToast('Success', 'Schedule created successfully', 'success');
        navigate('/scheduled');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao salvar schedule';
      showToast('Error', message, 'error');
    }
  };

  const renderCronFields = () => {
    const freqId = Number(frequencyId);
    switch (freqId) {
      case 1: // Minute
        return (
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Every (minutes)</label>
            <input
              type="number"
              {...register('cronSchedulling.minute.every')}
              className={fieldInputClass}
            />
          </div>
        );

      case 2: // Hourly
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Repeat every *</label>
              <Controller
                name="cronSchedulling.hourly.every"
                control={control}
                rules={{
                  required: 'Repeat every é obrigatório',
                  validate: (value) => {
                    if (!value || value === '') {
                      return 'Repeat every é obrigatório';
                    }
                    const num = Number(value);
                    if (isNaN(num) || num <= 0) {
                      return 'Deve ser maior que 0';
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className={fieldInputClass}
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Minute *</label>
              <Controller
                name="cronSchedulling.hourly.minute"
                control={control}
                rules={{
                  required: 'Minute é obrigatório',
                  validate: (value) => {
                    if (value === null || value === undefined || value === '') {
                      return 'Minute é obrigatório';
                    }
                    const num = Number(value);
                    if (isNaN(num) || num < 0 || num > 59) {
                      return 'Deve ser entre 0 e 59';
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      step="1"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className={fieldInputClass}
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        );

      case 3: // Daily
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Repeat every *</label>
              <input
                type="number"
                {...register('cronSchedulling.daily.every')}
                className={fieldInputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Hour</label>
                <input
                  type="number"
                  {...register('cronSchedulling.daily.hour')}
                  className={fieldInputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Minute</label>
                <input
                  type="number"
                  {...register('cronSchedulling.daily.minute')}
                  className={fieldInputClass}
                />
              </div>
            </div>
          </div>
        );

      case 4: // Weekly
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Repeat every *</label>
              <input
                type="number"
                {...register('cronSchedulling.weekly.every')}
                className={fieldInputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Day of Week</label>
              <Controller
                name="cronSchedulling.weekly.dayOfWeek"
                control={control}
                render={({ field }) => (
                  <select multiple {...field} className={fieldSelectClass}>
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>
        );

      case 5: // Monthly Day
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Repeat every *</label>
              <input
                type="number"
                {...register('cronSchedulling.monthlyDay.every')}
                className={fieldInputClass}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Day of Month</label>
                <input
                  type="number"
                  {...register('cronSchedulling.monthlyDay.dayOfMonth')}
                  className={fieldInputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Hour</label>
                <input
                  type="number"
                  {...register('cronSchedulling.monthlyDay.hour')}
                  className={fieldInputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Minute</label>
                <input
                  type="number"
                  {...register('cronSchedulling.monthlyDay.minute')}
                  className={fieldInputClass}
                />
              </div>
            </div>
          </div>
        );

      case 6: // Monthly Week
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Repeat every *</label>
              <input
                type="number"
                {...register('cronSchedulling.monthlyWeek.every')}
                className={fieldInputClass}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Week of Month</label>
                <input
                  type="number"
                  {...register('cronSchedulling.monthlyWeek.weekOfMonth')}
                  className={fieldInputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Day of Week</label>
                <select {...register('cronSchedulling.monthlyWeek.dayOfWeek')} className={fieldSelectClass}>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Hour</label>
                <input
                  type="number"
                  {...register('cronSchedulling.monthlyWeek.hour')}
                  className={fieldInputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Minute</label>
                <input
                  type="number"
                  {...register('cronSchedulling.monthlyWeek.minute')}
                  className={fieldInputClass}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-6">
        <button
          onClick={() => navigate('/scheduled')}
          className="text-primary hover:text-primary/80 mb-4 font-medium text-base"
        >
          ← {t('common.buttons.back')}
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">
          {isEditMode ? t('pages.schedule.editSchedule') : t('pages.schedule.createSchedule')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Card informativo - visível apenas no desktop, ocupa 1/3 */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6 rounded-2xl bg-purple border border-purple shadow-card p-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 text-white mb-5">
              <CalendarDaysIcon className="w-9 h-9" aria-hidden />
            </div>
            <h2 className="text-3xl font-semibold text-white mb-3">
              {isEditMode ? t('pages.schedule.editSchedule') : t('pages.schedule.newSchedule')}
            </h2>
            <div className="text-xl text-white/90 leading-relaxed space-y-4">
              {isEditMode ? (
                <>
                  <p>
                    Atualize as informações do agendamento conforme necessário.
                  </p>
                  <p className="font-medium text-white">Etapas:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-1">
                    <li>Altere o nome e o projeto, se precisar.</li>
                    <li>Ajuste prioridade e máquina de execução.</li>
                    <li>Atualize a frequência e os parâmetros de cron.</li>
                    <li>Revise os detalhes e salve.</li>
                  </ol>
                </>
              ) : (
                <>
                  <p>
                    Crie um agendamento para executar um projeto automaticamente em uma máquina.
                  </p>
                  <p className="font-medium text-white">Etapas:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-1">
                    <li>Informe o nome e escolha o projeto.</li>
                    <li>Defina a prioridade e a máquina de execução.</li>
                    <li>Escolha a frequência (minuto, hora, dia, semana ou mês).</li>
                    <li>Preencha os parâmetros de cron para quando a tarefa deve rodar.</li>
                    <li>Adicione os detalhes e crie o agendamento.</li>
                  </ol>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Formulário ocupa 2/3 no desktop */}
        <form onSubmit={handleSubmit(onSubmit)} className="min-w-0 lg:col-span-2 bg-white rounded-2xl shadow-card border border-border p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormInput
              label="Name"
              required
              placeholder="DOWLOANDS_NFE"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 5, message: 'Name must be at least 5 characters' },
              })}
            />
          </div>

          <div>
            <Controller
              name="projectId"
              control={control}
              rules={{ required: 'Project is required', min: { value: 1, message: 'Project is required' } }}
              render={({ field }) => (
                <FormSelect
                  label="Project"
                  required
                  error={errors.projectId?.message}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => {
                    if (e != null && e.target != null) {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) field.onChange(v);
                    }
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                >
                  <option value={0}>Select option</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </FormSelect>
              )}
            />
          </div>

          <div>
            <Controller
              name="priority"
              control={control}
              rules={{ required: 'Priority is required', min: { value: 1, message: 'Priority is required' } }}
              render={({ field }) => (
                <FormSelect
                  label="Priority"
                  required
                  error={errors.priority?.message}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => {
                    if (e != null && e.target != null) {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) field.onChange(v);
                    }
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                >
                  <option value={0}>Select option</option>
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </FormSelect>
              )}
            />
          </div>

          <div>
            <Controller
              name="frequencyId"
              control={control}
              rules={{ required: 'Frequency is required', min: { value: 1, message: 'Frequency is required' } }}
              render={({ field }) => (
                <FormSelect
                  label="Frequency"
                  required
                  error={errors.frequencyId?.message}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => {
                    if (e != null && e.target != null) {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) {
                        field.onChange(v);
                        setValue('frequencyId', v, { shouldValidate: true });
                      }
                    }
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                >
                  <option value={0}>Select option</option>
                  {frequencies.map((frequency) => (
                    <option key={frequency.id} value={frequency.id}>
                      {frequency.name}
                    </option>
                  ))}
                </FormSelect>
              )}
            />
          </div>

          <div>
            <Controller
              name="machineId"
              control={control}
              rules={{ required: 'Machine is required', min: { value: 1, message: 'Machine is required' } }}
              render={({ field }) => (
                <FormSelect
                  label="Machine"
                  required
                  error={errors.machineId?.message}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => {
                    if (e != null && e.target != null) {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) field.onChange(v);
                    }
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                >
                  <option value={0}>Select option</option>
                  {machines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.machineName}
                    </option>
                  ))}
                </FormSelect>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              label="Details"
              required
              rows={4}
              placeholder={t('pages.schedule.detailsPlaceholder')}
              error={errors.details?.message}
              {...register('details', {
                required: 'Details is required',
                minLength: { value: 5, message: 'Details must be at least 5 characters' },
              })}
            />
          </div>

          {Number(frequencyId) > 0 && (
            <div className="md:col-span-2 border-t border-border-form pt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Cron Scheduling</h3>
              {renderCronFields()}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <FormButton variant="secondary" type="button" onClick={() => navigate('/scheduled')}>
            {t('common.buttons.cancel')}
          </FormButton>
          <FormButton type="submit">{isEditMode ? t('pages.schedule.edit') : t('pages.schedule.create')}</FormButton>
        </div>
      </form>
      </div>
    </div>
  );
}
