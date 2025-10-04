import {SortDirection} from "./soft-diretction";

export type PaginationAndSorting<S> = {
    pageNumber: number;
    pageSize: number;
    sortBy: S;
    sortDirection: SortDirection;
};
