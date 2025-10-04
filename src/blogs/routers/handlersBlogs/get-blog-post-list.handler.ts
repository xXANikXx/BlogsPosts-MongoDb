import {Request, Response} from "express";
import {
    mapToPostListPaginatedOutput
} from "../../../posts/routers/mappers/map-to-post-list-paginated-output.util";
import {errorHandler} from "../../../core/errors/errors.handler";
import {postService} from "../../../posts/application/posts.service";
import {PostQueryInput} from "../../../posts/routers/input/post-query.input";


export async function getBlogPostListHandler(
    req: Request<{id: string}, {}, {}, PostQueryInput>,
    res: Response,
) {
    try {
        const blogId = req.params.id;
        const queryInput = req.query;

        const {items, totalCount} = await postService.findPostsByBlog(
            queryInput,
            blogId,
        );

        const postListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount
        });
        res.send(postListOutput);
    } catch (e: unknown) {
    errorHandler(e, res);
    }
}