import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { devicesService } from '../../service/devices.service';
import { useNotificationStore } from '../../service/notification.service';
import type { IDeviceCreateInputDto, IDeviceUpdateInputDto } from '../../types/models';

interface MachineFormData {
  machineName: string;
  environment: string;
  hostName: string;
  ip: string;
}

export default function Machine() {
  const { t } = useTranslation('translation');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
  const [registrationToken, setRegistrationToken] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MachineFormData>({
    defaultValues: {
      machineName: '',
      environment: '',
      hostName: '',
      ip: '',
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadDeviceById(Number(id));
    }
  }, [id, isEditMode]);

  const loadDeviceById = async (deviceId: number) => {
    try {
      const device = await devicesService.getByIdDevices(deviceId);
      setValue('machineName', device.machineName);
      setValue('environment', device.environment || '');
      setValue('hostName', device.hostName || '');
      setValue('ip', device.ip || '');
      setRegistrationToken(device.token || '');
    } catch (error) {
      console.error('Erro ao carregar máquina:', error);
    }
  };

  const copyRegistrationToken = async () => {
    if (!registrationToken) return;
    try {
      await navigator.clipboard.writeText(registrationToken);
      showToast(t('common.states.success'), t('pages.machines.tokenCopied'), 'success');
    } catch {
      showToast(t('common.states.error'), t('pages.machines.tokenCopied'), 'error');
    }
  };

  const onSubmit = async (data: MachineFormData) => {
    try {
      if (isEditMode && id) {
        const updateInput: IDeviceUpdateInputDto = {
          machineName: data.machineName,
          environment: data.environment,
          hostName: data.hostName,
          ip: data.ip,
        };
        await devicesService.updateDevice(Number(id), updateInput);
        showToast('Sucess', 'Machine edited successfully', 'success');
        navigate('/machines');
      } else {
        const inputMachine: IDeviceCreateInputDto = {
          machineName: data.machineName,
        };
        await devicesService.createDevice(inputMachine);
        showToast('Success', 'Machine created successfully', 'success');
        navigate('/machines');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao salvar máquina';
      showToast('Error', message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-6">
        <button
          onClick={() => navigate('/machines')}
          className="text-primary hover:text-primary/80 mb-4"
        >
          ← {t('pages.machines.back')}
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">
          {isEditMode ? t('pages.machines.titleEdit') : t('pages.machines.titleCreate')}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('pages.machines.machineName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('machineName', {
                required: t('pages.machines.machineNameRequired'),
                minLength: { value: 5, message: t('pages.machines.machineNameMinLength') },
              })}
              placeholder={t('pages.machines.machineName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.machineName && (
              <p className="mt-1 text-sm text-red-600">{errors.machineName.message}</p>
            )}
          </div>

          {isEditMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.machines.environment')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('environment', {
                    required: isEditMode ? t('pages.machines.environmentRequired') : false,
                    minLength: { value: 5, message: t('pages.machines.environmentMinLength') },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.environment && (
                  <p className="mt-1 text-sm text-red-600">{errors.environment.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.machines.hostname')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('hostName', {
                    required: isEditMode ? t('pages.machines.hostNameRequired') : false,
                    minLength: { value: 3, message: t('pages.machines.hostNameMinLength') },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.hostName && (
                  <p className="mt-1 text-sm text-red-600">{errors.hostName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.machines.ip')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('ip', {
                    required: isEditMode ? t('pages.machines.ipRequired') : false,
                    pattern: {
                      value:
                        /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
                      message: t('pages.machines.invalidIp'),
                    },
                  })}
                  placeholder="192.168.1.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.ip && <p className="mt-1 text-sm text-red-600">{errors.ip.message}</p>}
              </div>

              {registrationToken && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.machines.registrationToken')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={registrationToken}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={copyRegistrationToken}
                      className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shrink-0"
                    >
                      {t('pages.machines.copyToken')}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">
                    {t('pages.machines.registrationTokenHint')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/machines')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {t('common.buttons.cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {isEditMode ? t('common.buttons.save') : t('common.buttons.create')}
          </button>
        </div>
      </form>
    </div>
  );
}
