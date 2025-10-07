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
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";


export async function getPostListHandler(
    _req: Request<{}, {}, {}, PostQueryInput>,
    res: Response,
) {
    try {


        const queryInput = setDefaultSortAndPaginationIfNotExist(
            _req.query,
        );

        const pageNumber = Number(queryInput.pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSize = Number(queryInput.pageSize) || DEFAULT_PAGE_SIZE;

        const { items, totalCount } = await postService.findMany(queryInput)

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