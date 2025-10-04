import {Request,Response} from "express";
import {BlogQueryInput} from "../input/blog-query.input";
import {matchedData} from "express-validator";
import {
    setDefaultSortAndPaginationIfNotExist
} from "../../../core/helpers/set-default-sort-and-pagination";
import {blogsService} from "../../application/blogs.service";
import {errorHandler} from "../../../core/errors/errors.handler";
import {
    mapToBlogListPaginatedOutput
} from "../mappers/map-to-blog-list-paginated-output";

export async function getBlogListHandler(
    req: Request<{},{},{}, BlogQueryInput>,
    res: Response,) {
    try {
        const sanitizedQuery = matchedData<BlogQueryInput>(req,{
            locations: ['query'],
            includeOptionals: true,
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery)

        const { items, totalCount } = await blogsService.findMany(queryInput)

        const driversListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });


        res.send(driversListOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}