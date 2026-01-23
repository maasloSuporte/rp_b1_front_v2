import type { IPackageVersionsGetOutputDto } from "../../packageVersion/get/packageVersions-get-output-dto";

export interface IPackageGetOutputDto {
    id: number;
    name: string;
    description: string;
    packageVersions: IPackageVersionsGetOutputDto[];
 }
