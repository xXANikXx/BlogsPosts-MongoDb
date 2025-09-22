import {Request, Response} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {PostInputDTO} from "../../dtoPosts/post-input-dto";
import {Post} from "../../typesPosts/post";
import {postsRepository} from "../../repositoriesPosts/posts.repository";
import {PostViewDto} from "../../dtoPosts/post-view-dto";
import {generateId} from "../../../core/utils/generateId";
import {
    blogsRepository
} from "../../../blogs/repositoriesBlogs/blogs.repository";

export function createPostHandler(
    req: Request<{}, {}, PostInputDTO>,
    res: Response,
) {

    const blog = blogsRepository.findBlogById(req.body.blogId);
    if (!blog) {
        res.status(HttpStatus.NotFound).send({
            message: `Blog with id=${req.body.blogId} not found`,
        });
        return;
    }

    const newPost: Post = {
        id: generateId(),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blog.name,
    }

    postsRepository.createPost(newPost);

    const response:PostViewDto = newPost;

    res.status(HttpStatus.Created).send(response);

}