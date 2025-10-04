import { Request, Response } from "express";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import {PostUpdateInput} from "../input/post-update.input";
import {errorHandler} from "../../../core/errors/errors.handler";
import {postService} from "../../application/posts.service";

export async function updatePostHandler(
    req: Request<{ id: string }, {}, PostUpdateInput>,
    res: Response
) {
    try{
        const id = req.params.id;

       await postService.updatePost(id, req.body);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
       errorHandler(e,res);
    }
}
