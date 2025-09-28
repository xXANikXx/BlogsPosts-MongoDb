import {Request, Response} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {postsRepository} from "../../repositoriesPosts/posts.repository";

export async function deletePost(req: Request, res: Response) {
   try {
        const id = req.params.id;
        const post = await postsRepository.findPostById(id);

        if (!post) {
            res
                .status(HttpStatus.NotFound)
                .send(createErrorMessages([{
                    field: 'id',
                    message: 'Post not found.'
                }]));
            return;
        }

       await postsRepository.deletePost(id)
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
       res.sendStatus(HttpStatus.InternalServerError);
   }
}