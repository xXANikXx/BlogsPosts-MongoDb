import {Request,Response} from "express";
import {errorHandler} from "../../../core/errors/errors.handler";
import {postService} from "../../application/posts.service";
import {mapToPostOutput} from "../mappers/map-to-post-output.utill";


export async function getPostHandler (req: Request, res: Response){
    try {
        const id = req.params.id;

        const post = await postService.findByIdOrFail(id);

        const postOutput = mapToPostOutput(post)

        res.send(postOutput);
    } catch (e: unknown) {
        errorHandler(e,res);
    }
}