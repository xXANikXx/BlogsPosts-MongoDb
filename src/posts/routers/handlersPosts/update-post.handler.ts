import { Request, Response } from "express";
import { PostInputDTO } from "../../dtoPosts/post-input-dto";
import { vehicleInputDtoValidationPosts } from "../../validationPosts/vehicleInputDtoValidationPosts";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { postsRepository } from "../../repositoriesPosts/posts.repository";

export async function updatePostHandler(
    req: Request<{ id: string }, {}, PostInputDTO>,
    res: Response
) {
    try{
        const id = req.params.id;
        const post = await postsRepository.findPostById(id);

        if (!post) {
            res
                .status(HttpStatus.NotFound)
                .send(createErrorMessages([{
                    field: "id",
                    message: "Post not found"
                }]));
            return;
        }

       await postsRepository.updatePost(id, req.body);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
