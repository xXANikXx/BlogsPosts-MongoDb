import { SortDirection } from "./sort-diretction";

export type PaginationAndSorting<S> = {
    pageNumber: number;
    pageSize: number;
    sortBy: S;
    sortDirection: SortDirection;
};
