import { SortDirection } from "../../typesAny/sort-diretction";
import { PaginationAndSorting } from "../../typesAny/pagination-and-sorting";
import { query } from "express-validator";


export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
    pageNumber: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,
};

export function paginationAndSortingValidation<T extends string>(
    sortFieldEnum: Record<string, T>,
) {
    const allowedSortFields = Object.values(sortFieldEnum);

    return [

        query('searchNameTerm')
            .optional()
            .isString()
            .withMessage('Search name term must be a string')
            .trim(),


        query('pageNumber')
            .optional({ values: 'falsy' })
            .default(DEFAULT_PAGE_NUMBER)
            .toInt()
            .isInt({ min: 1 })
            .withMessage('Page number must be a positive integer'),

        query('pageSize')
            .optional({ values: 'falsy' })
            .default(DEFAULT_PAGE_SIZE)
            .toInt()
            .isInt({ min: 1, max: 100 })
            .withMessage('Page size must be between 1 and 100'),

        query('sortBy')
            .optional({ values: 'falsy' })
            .trim()
            .default(DEFAULT_SORT_BY)
            .isIn(allowedSortFields)
            .withMessage(
                `Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`,
            ),

        query('sortDirection')
            .optional({ values: 'falsy' })
            .trim()
            .default(DEFAULT_SORT_DIRECTION)
            .isIn(['asc', 'desc'])
            .withMessage(
                `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
            )

    ];
}