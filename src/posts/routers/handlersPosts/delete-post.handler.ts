import {Request, Response} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";
import {postService} from "../../application/posts.service";

export async function deletePost(req: Request, res: Response) {
   try {
        const id = req.params.id;
       await postService.deletePost(id)
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
       errorHandler(e,res);
   }
}