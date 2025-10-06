import { Request, Response } from "express";
import { PostCreateInput } from "../../../posts/routers/input/post-create.input";
import { errorHandler } from "../../../core/errors/errors.handler";
import { postService } from "../../../posts/application/posts.service";
import {
    mapToPostOutput
} from "../../../posts/routers/mappers/map-to-post-output.utill";
import { HttpStatus } from "../../../core/typesAny/http-statuses";


export async function createPostByBlogHandler(
    req: Request<{ id: string }, {}, PostCreateInput>,
    res: Response,
) {
    try {
        const blogId = req.params.id;
        const createPostId = await postService.createPostByBlog(req.body, blogId);

        const createPost = await postService.findByIdOrFail(createPostId);
        const postOutput = mapToPostOutput(createPost);

        res.status(HttpStatus.Created).send(postOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}