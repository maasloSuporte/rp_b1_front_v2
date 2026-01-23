import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { projectsService } from '../services/projects.service';
import { packagesService } from '../services/packages.service';
import { packagesVersionsService } from '../services/packagesVersions.service';
import { useNotificationStore } from '../services/notification.service';
import type {
  IProjectsCreateInputDto,
  IProjectUpdateInputDto,
  IPackageCompanyGetOutputDto,
  IPackageVersionGetOutputDto,
} from '../types/models';

interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  packageVersionId: number;
  active: boolean;
  autoUpdate: boolean;
  package: number;
}

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
  const [packageList, setPackageList] = useState<IPackageCompanyGetOutputDto[]>([]);
  const [packageVersions, setPackageVersions] = useState<IPackageVersionGetOutputDto[]>([]);
  const [isPackageSelected, setIsPackageSelected] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      description: '',
      status: '',
      packageVersionId: 0,
      active: false,
      autoUpdate: false,
      package: 0,
    },
  });

  const selectedPackage = watch('package');

  useEffect(() => {
    const initialize = async () => {
      await loadPackages();
      if (isEditMode && id) {
        await loadProjectById(Number(id));
      }
    };
    initialize();
  }, [id, isEditMode]);

  useEffect(() => {
    if (selectedPackage > 0) {
      loadPackageVersions(selectedPackage);
      setIsPackageSelected(true);
      setValue('packageVersionId', 0);
    } else {
      setPackageVersions([]);
      setIsPackageSelected(false);
      setValue('packageVersionId', 0);
    }
  }, [selectedPackage]);

  const loadPackages = async () => {
    try {
      const result = await packagesService.getPackageCompany();
      setPackageList(result);
    } catch (error) {
      console.error('Erro ao carregar packages:', error);
    }
  };

  const loadPackageVersions = async (packageId: number) => {
    try {
      const result = await packagesVersionsService.getByIdPackageVersion(packageId);
      setPackageVersions(result);
      setValue('packageVersionId', 0);
    } catch (error) {
      console.error('Erro ao carregar versões:', error);
    }
  };

  const loadProjectById = async (projectId: number) => {
    try {
      const project = await projectsService.getByIdProject(projectId);
      
      // Aguarda os packages serem carregados
      if (packageList.length === 0) {
        await loadPackages();
      }
      
      const selectedPackage = packageList.find((p) => p.name === project.packageName);
      const selectedPackageId = selectedPackage?.id ?? 0;

      setValue('name', project.name);
      setValue('description', project.description);
      setValue('status', project.status);
      setValue('active', project.active);
      setValue('autoUpdate', project.autoUpdate);
      setValue('packageVersionId', project.packageVersionId);
      setValue('package', selectedPackageId);

      if (selectedPackageId > 0) {
        await loadPackageVersions(selectedPackageId);
      }
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditMode && id) {
        const updateInput: IProjectUpdateInputDto = {
          projectName: data.name,
          description: data.description,
          status: data.status,
          packageVersionId: data.packageVersionId,
          active: data.active,
          autoUpdate: data.autoUpdate,
        };
        await projectsService.updateProject(Number(id), updateInput);
        showToast('Sucess', 'Project edited successfully', 'success');
        navigate('/automation');
      } else {
        const inputProject: IProjectsCreateInputDto = {
          projectName: data.name,
          description: data.description,
          status: data.status,
          packageVersionId: data.packageVersionId,
          active: data.active,
          autoUpdate: data.autoUpdate,
        };
        await projectsService.createProject(inputProject);
        showToast('Success', 'Project created successfully', 'success');
        navigate('/automation');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao salvar projeto';
      showToast('Error', message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-6">
        <button
          onClick={() => navigate('/automation')}
          className="text-primary hover:text-primary/80 mb-4"
        >
          ← Voltar
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">
          {isEditMode ? 'Edit Project' : 'Create Project'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6">
        <div className="grid grid-cols-1 gap-6">
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
              placeholder="DOWLOANDS_NFE"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Active</label>
              <select
                {...register('active')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auto Update Version</label>
              <select
                {...register('autoUpdate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('status', {
                required: 'Status is required',
                minLength: { value: 5, message: 'Status must be at least 5 characters' },
              })}
              placeholder="DOWLOANDS_NFE"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 5, message: 'Description must be at least 5 characters' },
              })}
              rows={4}
              placeholder="Projeto destinado a acessar o site da fazenda, e fazer downloads das nfes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Name <span className="text-red-500">*</span>
            </label>
            <select
              {...register('package', {
                required: 'Package is required',
                min: { value: 1, message: 'Package is required' },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={0}>Filter the package...</option>
              {packageList.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
            {errors.package && <p className="mt-1 text-sm text-red-600">{errors.package.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Version Package <span className="text-red-500">*</span>
            </label>
            <select
              {...register('packageVersionId', {
                required: 'Version package is required',
                min: { value: 1, message: 'Version package is required' },
              })}
              disabled={!isPackageSelected || isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value={0}>Filter the version…</option>
              {packageVersions.map((pkgVersion) => (
                <option key={pkgVersion.id} value={pkgVersion.id}>
                  {pkgVersion.version}
                </option>
              ))}
            </select>
            {errors.packageVersionId && (
              <p className="mt-1 text-sm text-red-600">{errors.packageVersionId.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/automation')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {isEditMode ? 'Edit' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
