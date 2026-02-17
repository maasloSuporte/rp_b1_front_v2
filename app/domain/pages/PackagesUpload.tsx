import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { packagesService } from '../../service/packages.service';
import { packagesVersionsService } from '../../service/packagesVersions.service';
import { technologyService } from '../../service/technology.service';
import { useNotificationStore } from '../../service/notification.service';
import type {
  IPackageCreateInputDto,
  IPackageVersionCreateInputDto,
  IPackageCompanyGetOutputDto,
  ITechnologyGetOutputDto,
} from '../../types/models';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface PackageFormData {
  name: string;
  description: string;
  technologyId: number;
  packageId: number;
  version: string;
  file: FileList | null;
}

export default function PackagesUpload() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useNotificationStore((state) => state.showToast);
  const [packageList, setPackageList] = useState<IPackageCompanyGetOutputDto[]>([]);
  const [technologies, setTechnologies] = useState<ITechnologyGetOutputDto[]>([]);
  const [technologiesLoadError, setTechnologiesLoadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [idSelectedPackage, setIdSelectedPackage] = useState<number | null>(null);

  const state = location.state as { isNew?: boolean; packageId?: number } | null;
  const isNewUpload = state?.isNew !== false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<PackageFormData>({
    defaultValues: {
      name: '',
      description: '',
      technologyId: 0,
      packageId: 0,
      version: '',
      file: null,
    },
  });

  const selectedPackageId = watch('packageId');
  const fileRegister = register('file', { required: t('pages.packagesUpload.fileRequired') });

  useEffect(() => {
    let cancelled = false;
    setTechnologiesLoadError(null);
    const load = async () => {
      try {
        const result = await technologyService.getTechnology();
        if (!cancelled) setTechnologies(Array.isArray(result) ? result : []);
      } catch (error: unknown) {
        if (!cancelled) {
          setTechnologies([]);
          const err = error as { response?: { status?: number; data?: { message?: string } } };
          const msg =
            err?.response?.status === 401
              ? 'Faça login para carregar as tecnologias.'
              : err?.response?.data?.message ?? 'Erro ao carregar tecnologias. Verifique a conexão com a API.';
          setTechnologiesLoadError(msg);
        }
        console.error('Erro ao carregar tecnologias:', error);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isNewUpload]);

  useEffect(() => {
    if (!isNewUpload) {
      loadPackages().then(() => {
        if (state?.packageId) {
          setValue('packageId', state.packageId);
          setIdSelectedPackage(state.packageId);
        }
      });
    }
  }, [isNewUpload, state?.packageId]);

  useEffect(() => {
    if (selectedPackageId > 0 && !isNewUpload) {
      loadPackageById(selectedPackageId);
    }
  }, [selectedPackageId, isNewUpload]);

  const loadTechnology = async () => {
    setTechnologiesLoadError(null);
    try {
      const result = await technologyService.getTechnology();
      setTechnologies(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Erro ao carregar tecnologias:', error);
      setTechnologies([]);
      setTechnologiesLoadError('Erro ao carregar tecnologias.');
    }
  };

  const loadPackages = async () => {
    try {
      const result = await packagesService.getPackageCompany();
      setPackageList(result);
    } catch (error) {
      console.error('Erro ao carregar packages:', error);
    }
  };

  const loadPackageById = async (packageId: number) => {
    try {
      const pkg = await packagesService.getByIdPackage(packageId);
      setValue('name', pkg.name);
      setValue('description', pkg.description);
      setValue('technologyId', pkg.technology);
      setIdSelectedPackage(packageId);
    } catch (error) {
      console.error('Erro ao carregar package:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileName(e.target.files[0].name);
      clearErrors('file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      // React Hook Form doesn't support FileList directly, so we need to create a DataTransfer
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setValue('file', dataTransfer.files as any, { shouldValidate: true });
      clearErrors('file');
    }
  };

  const onSubmit = async (data: PackageFormData) => {
    const log = '[PackagesUpload.onSubmit]';
    let createdPackageId: number | null = null;
    try {
      if (isNewUpload) {
        console.log(log, 'Criando novo pacote', { name: data.name, technologyId: data.technologyId });
        const inputPackage: IPackageCreateInputDto = {
          name: data.name,
          description: data.description,
          technologyId: data.technologyId,
        };

        const createdPackage = await packagesService.createPackege(inputPackage);
        createdPackageId = createdPackage.id;
        console.log(log, 'Pacote criado', { id: createdPackage.id });

        if (data.file && data.file.length > 0) {
          console.log(log, 'Enviando versão (zip)', { packageId: createdPackage.id, version: data.version, file: data.file[0]?.name });
          const inputPackageVersion: IPackageVersionCreateInputDto & { file: File } = {
            version: data.version,
            file: data.file[0],
            packageId: createdPackage.id,
            description: data.description,
          };

          await packagesVersionsService.createPackageVersion(inputPackageVersion);
          console.log(log, 'Versão criada com sucesso');
          showToast('Sucess', 'Package create successfully', 'success');
          navigate('/packages');
        }
      } else {
        if (data.file && data.file.length > 0 && idSelectedPackage) {
          console.log(log, 'Upgrade versão', { packageId: idSelectedPackage, version: data.version, file: data.file[0]?.name });
          const inputPackageVersion: IPackageVersionCreateInputDto & { file: File } = {
            version: data.version,
            file: data.file[0],
            packageId: idSelectedPackage,
            description: data.description,
          };

          await packagesVersionsService.createPackageVersion(inputPackageVersion);
          console.log(log, 'Versão atualizada com sucesso');
          showToast('Sucess', 'Package version update successfully', 'success');
          navigate('/packages');
        }
      }
    } catch (error: unknown) {
      if (createdPackageId != null) {
        try {
          await packagesService.deletePackage(createdPackageId);
          console.log(log, 'Pacote órfão removido após falha na versão', { id: createdPackageId });
        } catch (deleteErr) {
          console.error(log, 'Falha ao remover pacote órfão', deleteErr);
        }
      }
      const err = error as {
        response?: {
          data?: {
            message?: string;
            detail?: string;
            title?: string;
            extensions?: { errorDescription?: string };
          };
          status?: number;
        };
        code?: string;
      };
      const data = err?.response?.data;
      const message =
        data?.extensions?.errorDescription ??
        data?.detail ??
        data?.title ??
        data?.message ??
        t('pages.packagesUpload.uploadError');
      console.error(log, 'Erro no submit', { message, status: err?.response?.status, code: err?.code, data });
      showToast('Error', message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-6">
        <button
          onClick={() => navigate('/packages')}
          className="text-primary hover:text-primary/80 mb-4"
        >
          ← {t('pages.packagesUpload.back')}
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">{t('pages.packagesUpload.title')}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6">
        <div className="grid grid-cols-1 gap-6">
          {isNewUpload && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.packagesUpload.packageName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name', {
                  required: isNewUpload ? t('pages.packagesUpload.nameRequired') : false,
                  minLength: { value: 5, message: t('pages.packagesUpload.nameMinLength') },
                })}
                placeholder="DOWLOANDS_NFE"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
          )}

          {!isNewUpload && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.packagesUpload.packageLabel')} <span className="text-red-500">*</span>
              </label>
              <select
                {...register('packageId', {
                  required: !isNewUpload ? t('pages.packagesUpload.packageRequired') : false,
                  min: { value: 1, message: t('pages.packagesUpload.packageRequired') },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={0}>{t('pages.packagesUpload.filterPackage')}</option>
                {packageList.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
              {errors.packageId && (
                <p className="mt-1 text-sm text-red-600">{errors.packageId.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('pages.packagesUpload.description')} <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description', {
                required: t('pages.packagesUpload.descriptionRequired'),
                minLength: { value: 5, message: t('pages.packagesUpload.descriptionMinLength') },
              })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {isNewUpload && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.packagesUpload.technology')} <span className="text-red-500">*</span>
              </label>
              <select
                {...register('technologyId', {
                  required: isNewUpload ? t('pages.packagesUpload.technologyRequired') : false,
                  min: { value: 1, message: t('pages.packagesUpload.technologyRequired') },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={technologies.length === 0 && !!technologiesLoadError}
              >
                <option value={0}>{t('pages.packagesUpload.filterTechnology')}</option>
                {technologies.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
              {technologiesLoadError && (
                <p className="mt-1 text-sm text-amber-600 flex items-center gap-2">
                  {technologiesLoadError}
                  <button
                    type="button"
                    onClick={loadTechnology}
                    className="text-primary hover:underline font-medium"
                  >
                    Tentar novamente
                  </button>
                </p>
              )}
              {technologies.length === 0 && !technologiesLoadError && (
                <p className="mt-1 text-sm text-gray-500">Carregando tecnologias...</p>
              )}
              {errors.technologyId && (
                <p className="mt-1 text-sm text-red-600">{errors.technologyId.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('pages.packagesUpload.version')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('version', {
                required: t('pages.packagesUpload.versionRequired'),
                pattern: {
                  value: /^\d+\.\d+\.\d+$/,
                  message: t('pages.packagesUpload.versionFormat'),
                },
              })}
              placeholder="1.0.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.version && <p className="mt-1 text-sm text-red-600">{errors.version.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('pages.packagesUpload.file')} <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
            >
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <input
                type="file"
                {...fileRegister}
                onChange={(e) => {
                  if (fileRegister.onChange) {
                    fileRegister.onChange(e);
                  }
                  handleFileChange(e);
                }}
                className="hidden"
                id="file-upload"
                accept=".zip,.rar,.7z"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-primary hover:text-primary/80 font-medium"
              >
                {t('pages.packagesUpload.clickToUpload')}
              </label>
              {selectedFileName && (
                <p className="mt-2 text-sm text-gray-600">{t('pages.packagesUpload.selectedFile')}: {selectedFileName}</p>
              )}
              {errors.file && (
                <p className="mt-2 text-sm text-red-600">{errors.file.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/packages')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {t('pages.packagesUpload.cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {isNewUpload ? t('pages.packagesUpload.create') : t('pages.packagesUpload.upgrade')}
          </button>
        </div>
      </form>
    </div>
  );
}
