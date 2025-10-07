import { Request, Response } from "express";
import { BlogQueryInput } from "../input/blog-query.input";
import { matchedData } from "express-validator";
import {
    setDefaultSortAndPaginationIfNotExist
} from "../../../core/helpers/set-default-sort-and-pagination";
import { blogsService } from "../../application/blogs.service";
import { errorHandler } from "../../../core/errors/errors.handler";
import {
    mapToBlogListPaginatedOutput
} from "../mappers/map-to-blog-list-paginated-output";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";


export async function getBlogListHandler(
    _req: Request<{}, {}, {}, BlogQueryInput>,
    res: Response,) {
    try {

        const queryInput = setDefaultSortAndPaginationIfNotExist(_req.query)

        const pageNumber = Number(queryInput.pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSize = Number(queryInput.pageSize) || DEFAULT_PAGE_SIZE;

        const { items, totalCount } = await blogsService.findMany(queryInput)

        const blogListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: pageNumber, // Используем проверенное число
            pageSize: pageSize,     // Используем проверенное число
            totalCount,
        });


        res.status(HttpStatus.Ok).send(blogListOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}