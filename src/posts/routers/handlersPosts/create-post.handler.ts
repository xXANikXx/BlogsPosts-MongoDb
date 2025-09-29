import {Request, Response} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {PostInputDTO} from "../../dtoPosts/post-input-dto";
import {Post} from "../../typesPosts/post";
import {postsRepository} from "../../repositoriesPosts/posts.repository";
import {
    blogsRepository
} from "../../../blogs/repositoriesBlogs/blogs.repository";
import {mapToPostViewModel} from "../mappers/map-to-post-view-model.util";
import {ObjectId} from "mongodb";

export async function createPostHandler(
    req: Request<{}, {}, PostInputDTO>,
    res: Response,
) {
try {

    const blogId = req.body.blogId;

    if (!blogId || !ObjectId.isValid(blogId)) {
        res.status(HttpStatus.NotFound).send({
            message: `Blog with id=${blogId} not found`,
        });
        return;
    }

    const blog = await blogsRepository.findBlogById(blogId);

    if (!blog) {
        res.status(HttpStatus.NotFound).send({
            message: `Blog with id=${blogId} not found`,
        });
        return;
    }

    const newPost: Post = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blog.name,
        createdAt: new Date().toISOString(),
    }

    const createdPost = await postsRepository.createPost(newPost);
    const postViewModel = mapToPostViewModel(createdPost)

    res.status(HttpStatus.Created).send(postViewModel);
}catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
}
}