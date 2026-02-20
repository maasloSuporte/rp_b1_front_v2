import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
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
  active: string;
  autoUpdate: string;
  package: number;
}

export default function Project() {
  const { t } = useTranslation('translation');
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
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      status: '',
      packageVersionId: 0,
      active: 'false',
      autoUpdate: 'false',
      package: 0,
    },
  });

  const watched = watch();
  const selectedPackage = watched.package;

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
      if (!isEditMode) {
        setValue('packageVersionId', 0);
      }
    } else {
      setPackageVersions([]);
      setIsPackageSelected(false);
      setValue('packageVersionId', 0);
    }
  }, [selectedPackage, isEditMode]);

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
      setValue('active', project.active ? 'true' : 'false');
      setValue('autoUpdate', project.autoUpdate ? 'true' : 'false');
      setValue('package', selectedPackageId);

      if (selectedPackageId > 0) {
        await loadPackageVersions(selectedPackageId);
        setValue('packageVersionId', project.packageVersionId);
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
          active: data.active === 'true',
          autoUpdate: data.autoUpdate === 'true',
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
          active: data.active === 'true',
          autoUpdate: data.autoUpdate === 'true',
        };
        await projectsService.createProject(inputProject);
        showToast('Success', 'Project created successfully', 'success');
        navigate('/automation');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || t('pages.project.saveError');
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
          ← {t('pages.project.back')}
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">
          {isEditMode ? t('pages.project.titleEdit') : t('pages.project.titleCreate')}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-card p-8">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <FormInput
              label={t('pages.project.name')}
              required
              placeholder="DOWLOANDS_NFE"
              error={errors.name?.message}
              {...register('name', {
                required: t('pages.project.nameRequired'),
                minLength: { value: 5, message: t('pages.project.nameMinLength') },
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormSelect label={t('pages.project.active')} value={watched.active} {...register('active')}>
                <option value="true">{t('common.true')}</option>
                <option value="false">{t('common.false')}</option>
              </FormSelect>
            </div>
            <div>
              <FormSelect label={t('pages.project.autoUpdateVersion')} value={watched.autoUpdate} {...register('autoUpdate')}>
                <option value="true">{t('common.true')}</option>
                <option value="false">{t('common.false')}</option>
              </FormSelect>
            </div>
          </div>

          <div>
            <FormInput
              label={t('pages.project.status')}
              required
              placeholder="DOWLOANDS_NFE"
              error={errors.status?.message}
              {...register('status', {
                required: t('pages.project.statusRequired'),
                minLength: { value: 5, message: t('pages.project.statusMinLength') },
              })}
            />
          </div>

          <div>
            <FormTextarea
              label={t('pages.project.description')}
              required
              rows={4}
              placeholder="Projeto destinado a acessar o site da fazenda, e fazer downloads das nfes"
              error={errors.description?.message}
              {...register('description', {
                required: t('pages.project.descriptionRequired'),
                minLength: { value: 5, message: t('pages.project.descriptionMinLength') },
              })}
            />
          </div>

          <div>
            <FormSelect
              label={t('pages.project.packageName')}
              value={watched.package}
              error={errors.package?.message}
              {...register('package')}
            >
              <option value={0}>{t('pages.project.noneOptional')}</option>
              {packageList.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </FormSelect>
          </div>

          <div>
            <FormSelect
              label={t('pages.project.versionPackage')}
              value={watched.packageVersionId}
              error={errors.packageVersionId?.message}
              disabled={!isPackageSelected}
              className="disabled:bg-background disabled:cursor-not-allowed"
              {...register('packageVersionId')}
            >
              <option value={0}>{t('pages.project.noneOptional')}</option>
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
            {t('common.buttons.cancel')}
          </FormButton>
          <FormButton type="submit">{isEditMode ? t('common.buttons.edit') : t('common.buttons.create')}</FormButton>
        </div>
      </form>
    </div>
  );
}
