import {Request, Response} from "express";
import {postsRepository} from "../../repositoriesPosts/posts.repository";

export function getPostListHandler(_req: Request, res: Response) {
    const posts = postsRepository.findAllPosts();
    res.send(posts);
}