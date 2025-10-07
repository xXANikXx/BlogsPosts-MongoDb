import { PostOutput } from "./post.output";

export type PostListPaginatedOutput = {
    pagesCount: number;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    items: PostOutput[];
}