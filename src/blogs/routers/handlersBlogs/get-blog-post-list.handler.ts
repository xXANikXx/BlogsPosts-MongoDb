import { Request, Response } from "express";
import {
    mapToPostListPaginatedOutput
} from "../../../posts/routers/mappers/map-to-post-list-paginated-output.util";
import { errorHandler } from "../../../core/errors/errors.handler";
import { postService } from "../../../posts/application/posts.service";
import { PostQueryInput } from "../../../posts/routers/input/post-query.input";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { matchedData } from "express-validator";
import {
    setDefaultSortAndPaginationIfNotExist
} from "../../../core/helpers/set-default-sort-and-pagination";


export async function getBlogPostListHandler(
    req: Request<{ id: string }, {}, {}, PostQueryInput>,
    res: Response,
) {
    try {
        const blogId = req.params.id;

        const sanitizedQuery = matchedData<PostQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        })
        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);


        const { items, totalCount } = await postService.findPostsByBlog(
            queryInput,
            blogId,
        );


        const postListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HttpStatus.Ok).send(postListOutput);
    } catch (e: unknown) {

        errorHandler(e, res);
    }
}