import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { assetsService } from '../services/assets.service';
import { useNotificationStore } from '../services/notification.service';
import type {
  IAssetCreateInputDto,
  IAssetUpdateInputDto,
} from '../types/models';

interface AssetFormData {
  name: string;
  type: string;
  description: string;
  value: string;
  userName: string;
  globalValue: boolean;
  projectId: number;
}

export default function Asset() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AssetFormData>({
    defaultValues: {
      name: '',
      type: 'Text',
      description: '',
      value: '',
      userName: '',
    },
  });

  const typeValue = watch('type');

  useEffect(() => {
    if (isEditMode && id) {
      loadAssetById(Number(id));
    }
  }, [id, isEditMode]);

  const loadAssetById = async (assetId: number) => {
    try {
      const asset = await assetsService.getByIdAsset(assetId);
      console.log(asset)
      setValue('name', asset.name);
      setValue('type', asset.type);
      setValue('description', asset.description);
      setValue('value', asset.value);
      setValue('userName', asset.userName || '');
    } catch (error) {
      console.error('Erro ao carregar asset:', error);
    }
  };

  const onSubmit = async (data: AssetFormData) => {
    try {
      if (isEditMode && id) {
        const updateAsset: IAssetUpdateInputDto = {
          name: data.name,
          type: data.type,
          description: data.description,
          value: data.value,
          userName: data.userName,
          globalValue: data.globalValue,
          projectId: data.projectId,
        };
        await assetsService.updateAsset(Number(id), updateAsset);
        showToast('Sucess', 'Asset edited successfully', 'success');
        navigate('/assets');
      } else {
        const inputAsset: IAssetCreateInputDto = {
          name: data.name,
          type: data.type,
          description: data.description,
          value: data.value,
          userName: data.userName,
        };
        await assetsService.createAsset(inputAsset);
        showToast('Success', 'Asset created successfully', 'success');
        navigate('/assets');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao salvar asset';
      showToast('Error', message, 'error');
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setValue('type', selectedType);
    if (selectedType === 'Bool') {
      setValue('value', 'false');
    } else {
      setValue('value', '');
      setValue('userName', '');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-6">
        <button
          onClick={() => navigate('/assets')}
          className="text-primary hover:text-primary/80 mb-4"
        >
          ← Voltar
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">
          {isEditMode ? 'Edit Asset' : 'Create Asset'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 5, message: 'Name must be at least 5 characters' },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('type', { required: 'Type is required' })}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Text">Text</option>
              <option value="Integer">Integer</option>
              <option value="Bool">Bool</option>
              <option value="Credential">Credential</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 5, message: 'Description must be at least 5 characters' },
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {typeValue === 'Text' && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('value', { required: 'Value is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>}
            </div>
          )}

          {typeValue === 'Integer' && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('value', { required: 'Value is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>}
            </div>
          )}

          {typeValue === 'Bool' && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value <span className="text-red-500">*</span>
              </label>
              <select
                {...register('value', { required: 'Value is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
              {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>}
            </div>
          )}

          {typeValue === 'Credential' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...register('value', { required: 'Value is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.value && (
                  <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('userName', {
                    required: typeValue === 'Credential' ? 'User Name is required' : false,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600">{errors.userName.message}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/assets')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 rounded-md hover:bg-primary/90"
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
