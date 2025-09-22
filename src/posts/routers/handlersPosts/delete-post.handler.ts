import {Request, Response} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {postsRepository} from "../../repositoriesPosts/posts.repository";

export function deletePost(req: Request, res: Response) {
    const id = req.params.id;
    const post = postsRepository.findPostById(id);

    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{field: 'id', message: 'Post not found.'}]));
        return;
    }

    postsRepository.deletePost(id)
    res.sendStatus(HttpStatus.NoContent);
}