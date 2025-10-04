import {
    PaginationAndSorting
} from "../../../core/typesAny/pagination-and-sorting";
import {PostSortField} from "./post-soft-field";

export type PostQueryInput = PaginationAndSorting<PostSortField>;