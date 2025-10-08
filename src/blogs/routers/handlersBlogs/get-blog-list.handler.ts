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


        const queryInput: BlogQueryInput = matchedData<BlogQueryInput>(_req, {
            locations: ['query'],
            includeOptionals: true,
        }); //утилита для извечения трансформированных значений после валидатара
        //в req.query остаются сырые квери параметры (строки)

        console.log('Matched data:', queryInput);

        const finalPageNumber = queryInput.pageNumber || 1;
        const finalPageSize = queryInput.pageSize || 10;

        const queryWithDefaults: BlogQueryInput = {
            ...queryInput,
            pageNumber: finalPageNumber,
            pageSize: finalPageSize,
        };

        const { items, totalCount } = await blogsService.findMany(queryWithDefaults)

        console.log('🧩 QUERY INPUT BEFORE MAPPER:', queryInput);


        const blogListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: finalPageNumber,
            pageSize: finalPageSize,
            totalCount,
        });


        res.status(HttpStatus.Ok).send(blogListOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}