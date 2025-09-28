import {Request, Response} from "express";
import {postsRepository} from "../../repositoriesPosts/posts.repository";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {mapToPostViewModel} from "../mappers/map-to-post-view-model.util";

export async function getPostListHandler(_req: Request, res: Response) {
   try {
        const posts = await postsRepository.findAllPosts();
        const postViewModel = posts.map(mapToPostViewModel)
        res.send(postViewModel);

    } catch (e: unknown) {
       res.sendStatus(HttpStatus.InternalServerError);
   }
}