import {Request,Response} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {postsRepository} from "../../repositoriesPosts/posts.repository";
import {mapToPostViewModel} from "../mappers/map-to-post-view-model.util";


export async function getPostHandler (req: Request, res: Response){
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
        const postViewModel = mapToPostViewModel(post)
        res.send(postViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}