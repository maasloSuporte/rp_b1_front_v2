export interface IProjectUpdateInputDto { 
    projectName: string;
    description: string;
    status: string;
    packageVersionId: number;
    active: boolean;
    autoUpdate: boolean;
}
