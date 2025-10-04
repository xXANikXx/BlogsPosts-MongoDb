import {Request, Response} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {PostCreateInput} from "../input/post-create.input";
import {postService} from "../../application/posts.service";
import {mapToPostOutput} from "../mappers/map-to-post-output.utill";
import {errorHandler} from "../../../core/errors/errors.handler";

export async function createPostHandler(
    req: Request<{}, {}, PostCreateInput>,
    res: Response,
) {
try {

    const createPostId = await postService.createPost(req.body);
    const createPost = await postService.findByIdOrFail(createPostId);
    const postOutput = mapToPostOutput(createPost);

    res.status(HttpStatus.Created).send(postOutput);
}catch (e: unknown) {
    errorHandler(e, res);
}
}