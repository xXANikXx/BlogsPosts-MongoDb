import {
    PaginationAndSorting
} from "../../../core/typesAny/pagination-and-sorting";
import {BlogSortField} from "./blog-soft-field";


export type BlogQueryInput = PaginationAndSorting<BlogSortField> &
    Partial<{
    searchNameTerm: string;
    }>