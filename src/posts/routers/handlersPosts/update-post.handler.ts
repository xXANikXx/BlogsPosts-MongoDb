import { Request, Response } from "express";
import { PostInputDTO } from "../../dtoPosts/post-input-dto";
import { vehicleInputDtoValidationPosts } from "../../validationPosts/vehicleInputDtoValidationPosts";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { postsRepository } from "../../repositoriesPosts/posts.repository";

export function updatePostHandler(
    req: Request<{ id: string }, {}, PostInputDTO>,
    res: Response
) {
    const id = req.params.id;
    const errors = vehicleInputDtoValidationPosts(req.body);

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
    }

    const post = postsRepository.findPostById(id);
    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{ field: "id", message: "Post not found" }]));
        return;
    }

    postsRepository.updatePost(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
}
