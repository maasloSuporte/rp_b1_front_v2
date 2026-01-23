export interface IPaginationOutputDto<T> {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    items: T[];
}
