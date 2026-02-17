import api from './api';
import type {
  IPackageVersionCreateInputDto,
  IPackageVersionCreateOutputDto,
  IPackageVersionGetOutputDto,
} from '../types/models';

const LOG = '[packagesVersions]';

export const packagesVersionsService = {
  createPackageVersion: async (
    packageVersion: IPackageVersionCreateInputDto & { file: File }
  ): Promise<IPackageVersionCreateOutputDto> => {
    const formData = new FormData();
    formData.append('File', packageVersion.file, packageVersion.file.name);
    formData.append('Description', packageVersion.description);
    formData.append('PackageId', packageVersion.packageId.toString());
    formData.append('Version', packageVersion.version ?? '');

    console.log(`${LOG} createPackageVersion: payload`, {
      packageId: packageVersion.packageId,
      version: packageVersion.version,
      description: packageVersion.description,
      fileName: packageVersion.file?.name,
      fileSize: packageVersion.file?.size,
      formDataKeys: Array.from(formData.keys()),
    });

    try {
      const response = await api.post<IPackageVersionCreateOutputDto>(
        '/packageVersions',
        formData,
        { timeout: 120000 } // 2 min; Content-Type é removido pelo interceptor quando data é FormData
      );
      console.log(`${LOG} createPackageVersion: success`, response.status, response.data);
      return response.data;
    } catch (err: unknown) {
      const axiosErr = err as { code?: string; message?: string; response?: { status?: number; data?: unknown } };
      console.error(`${LOG} createPackageVersion: error`, {
        code: axiosErr?.code,
        message: axiosErr?.message,
        status: axiosErr?.response?.status,
        data: axiosErr?.response?.data,
      });
      throw err;
    }
  },

  getDownloadPackage: async (id: number): Promise<Blob> => {
    const response = await api.get(`/packageVersions/download/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getByIdPackageVersion: async (packageVersionId: number): Promise<IPackageVersionGetOutputDto[]> => {
    const response = await api.get<IPackageVersionGetOutputDto[]>(
      `/packageVersions/listPackage/${packageVersionId}`
    );
    return response.data;
  },
};
