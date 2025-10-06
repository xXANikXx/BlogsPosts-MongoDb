import { Request, Response } from "express";
import { errorHandler } from "../../../core/errors/errors.handler";
import { PostQueryInput } from "../input/post-query.input";
import {
    setDefaultSortAndPaginationIfNotExist
} from "../../../core/helpers/set-default-sort-and-pagination";
import {
    mapToPostListPaginatedOutput
} from "../mappers/map-to-post-list-paginated-output.util";
import { matchedData } from "express-validator";
import { postService } from "../../application/posts.service";
import { HttpStatus } from "../../../core/typesAny/http-statuses";

export async function getPostListHandler(
    _req: Request<{}, {}, {}, PostQueryInput>,
    res: Response,
) {
    try {

        const sanitizedQuery = matchedData<PostQueryInput>(_req, {
            locations: ['query'],
            includeOptionals: true,
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist({
            ...sanitizedQuery,
            pageNumber: Number(sanitizedQuery.pageNumber),
            pageSize: Number(sanitizedQuery.pageSize),
        });

        const { items, totalCount } = await postService.findMany(queryInput)

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