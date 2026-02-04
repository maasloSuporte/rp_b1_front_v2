import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);

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
    } catch (error) {
      console.error('Erro ao carregar máquina:', error);
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
          ← Voltar
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">
          {isEditMode ? 'Edit Machine' : 'Create Machine'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Machine Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('machineName', {
                required: 'Machine name is required',
                minLength: { value: 5, message: 'Machine name must be at least 5 characters' },
              })}
              placeholder="Machine name"
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
                  Environment <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('environment', {
                    required: isEditMode ? 'Environment is required' : false,
                    minLength: { value: 5, message: 'Environment must be at least 5 characters' },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.environment && (
                  <p className="mt-1 text-sm text-red-600">{errors.environment.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Host Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('hostName', {
                    required: isEditMode ? 'Host name is required' : false,
                    minLength: { value: 3, message: 'Host name must be at least 3 characters' },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.hostName && (
                  <p className="mt-1 text-sm text-red-600">{errors.hostName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('ip', {
                    required: isEditMode ? 'IP is required' : false,
                    pattern: {
                      value:
                        /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
                      message: 'Invalid IP address format',
                    },
                  })}
                  placeholder="192.168.1.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.ip && <p className="mt-1 text-sm text-red-600">{errors.ip.message}</p>}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/machines')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
