import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { projectsService } from '../../service/projects.service';
import { packagesService } from '../../service/packages.service';
import { packagesVersionsService } from '../../service/packagesVersions.service';
import { useNotificationStore } from '../../service/notification.service';
import { FormInput, FormSelect, FormTextarea, FormButton } from '../../components/ui';
import type {
  IProjectsCreateInputDto,
  IProjectUpdateInputDto,
  IPackageCompanyGetOutputDto,
  IPackageVersionGetOutputDto,
} from '../../types/models';

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

      return result;
    } catch (error) {
      console.error('Erro ao carregar packages:', error);
    }
  };

  const loadPackageVersions = async (packageId: number) => {
    try {
      const result = await packagesVersionsService.getByIdPackageVersion(packageId);
      setPackageVersions(result);
      return result;
    } catch (error) {
      console.error('Erro ao carregar versões:', error);
    }
  };

  const loadProjectById = async (projectId: number) => {
    try {
      const project = await projectsService.getByIdProject(projectId);

      const list = await loadPackages() || [];
      const selectedPackage = list.find((p) => p.name === project.packageName);
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

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-card p-8">
        <div className="grid grid-cols-1 gap-6">
          <div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormSelect label="Active" {...register('active')}>
                <option value="true">True</option>
                <option value="false">False</option>
              </FormSelect>
            </div>
            <div>
              <FormSelect label="Auto Update Version" {...register('autoUpdate')}>
                <option value="true">True</option>
                <option value="false">False</option>
              </FormSelect>
            </div>
          </div>

          <div>
            <FormInput
              label="Status"
              required
              placeholder="DOWLOANDS_NFE"
              error={errors.status?.message}
              {...register('status', {
                required: 'Status is required',
                minLength: { value: 5, message: 'Status must be at least 5 characters' },
              })}
            />
          </div>

          <div>
            <FormTextarea
              label="Description"
              required
              rows={4}
              placeholder="Projeto destinado a acessar o site da fazenda, e fazer downloads das nfes"
              error={errors.description?.message}
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 5, message: 'Description must be at least 5 characters' },
              })}
            />
          </div>

          <div>
            <FormSelect
              label="Package Name"
              required
              error={errors.package?.message}
              {...register('package', {
                required: 'Package is required',
                min: { value: 1, message: 'Package is required' },
              })}
            >
              <option value={0}>Filter the package...</option>
              {packageList.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </FormSelect>
          </div>

          <div>
            <FormSelect
              label="Version Package"
              required
              error={errors.packageVersionId?.message}
              disabled={!isPackageSelected || isEditMode}
              className="disabled:bg-background disabled:cursor-not-allowed"
              {...register('packageVersionId', {
                required: 'Version package is required',
                min: { value: 1, message: 'Version package is required' },
              })}
            >
              <option value={0}>Filter the version…</option>
              {packageVersions.map((pkgVersion) => (
                <option key={pkgVersion.id} value={pkgVersion.id}>
                  {pkgVersion.version}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <FormButton variant="secondary" type="button" onClick={() => navigate('/automation')}>
            Cancel
          </FormButton>
          <FormButton type="submit">{isEditMode ? 'Edit' : 'Create'}</FormButton>
        </div>
      </form>
    </div>
  );
}
