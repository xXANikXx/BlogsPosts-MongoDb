import { Request, Response } from "express";
import {
    mapToPostListPaginatedOutput
} from "../../../posts/routers/mappers/map-to-post-list-paginated-output.util";
import { errorHandler } from "../../../core/errors/errors.handler";
import { postService } from "../../../posts/application/posts.service";
import { PostQueryInput } from "../../../posts/routers/input/post-query.input";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";


export async function getBlogPostListHandler(
    req: Request<{ id: string }, {}, {}, PostQueryInput>,
    res: Response,
) {
    try {
        const blogId = req.params.id;
        const queryInput = req.query;

        const pageNumber = Number(queryInput.pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSize = Number(queryInput.pageSize) || DEFAULT_PAGE_SIZE;

        const { items, totalCount } = await postService.findPostsByBlog(
            queryInput,
            blogId,
        );


        const postListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: pageNumber, // Используем проверенное число
            pageSize: pageSize,     // Используем проверенное число
            totalCount,
        });

        res.status(HttpStatus.Ok).send(postListOutput);
    } catch (e: unknown) {

        errorHandler(e, res);
    }
}