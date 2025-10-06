import { Request, Response } from "express";
import { errorHandler } from "../../../core/errors/errors.handler";
import { postService } from "../../application/posts.service";
import { mapToPostOutput } from "../mappers/map-to-post-output.utill";
import { HttpStatus } from "../../../core/typesAny/http-statuses";

export async function getPostHandler(req: Request, res: Response) {
    try {
        const id = req.params.id;

        const post = await postService.findByIdOrFail(id);

        const postOutput = mapToPostOutput(post)

        res.status(HttpStatus.Ok).send(postOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}