import api from './api';
import type {
  IPackageVersionCreateInputDto,
  IPackageVersionCreateOutputDto,
  IPackageVersionGetOutputDto,
} from '../types/models';

export const packagesVersionsService = {
  createPackageVersion: async (
    packageVersion: IPackageVersionCreateInputDto & { file: File }
  ): Promise<IPackageVersionCreateOutputDto> => {
    const formData = new FormData();
    formData.append('File', packageVersion.file, packageVersion.file.name);

    const params = new URLSearchParams();
    params.append('Description', packageVersion.description);
    params.append('PackageId', packageVersion.packageId.toString());
    params.append('Version', packageVersion.version);

    const response = await api.post<IPackageVersionCreateOutputDto>(
      `/packageVersions?${params.toString()}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
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
