import { Request, Response } from "express";
import {
    mapToPostListPaginatedOutput
} from "../../../posts/routers/mappers/map-to-post-list-paginated-output.util";
import { errorHandler } from "../../../core/errors/errors.handler";
import { postService } from "../../../posts/application/posts.service";
import { PostQueryInput } from "../../../posts/routers/input/post-query.input";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { matchedData } from "express-validator";
import { BlogQueryInput } from "../input/blog-query.input";
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
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist({
            ...sanitizedQuery,
            pageNumber: Number(sanitizedQuery.pageNumber),
            pageSize: Number(sanitizedQuery.pageSize),
        });

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