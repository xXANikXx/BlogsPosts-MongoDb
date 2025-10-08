import { PaginationAndSorting } from "../typesAny/pagination-and-sorting";
import {
    paginationAndSortingDefault
} from "../middlewares/validation/query-pagination-sorting.validation-middleware";


export function setDefaultSortAndPaginationIfNotExist<P = string>(
    query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
    return {
        pageNumber: query.pageNumber ? Number(query.pageNumber) : paginationAndSortingDefault.pageNumber,
        pageSize: query.pageSize ? Number(query.pageSize) : paginationAndSortingDefault.pageSize,
        sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
        sortDirection: query.sortDirection ?? paginationAndSortingDefault.sortDirection,
    };
}