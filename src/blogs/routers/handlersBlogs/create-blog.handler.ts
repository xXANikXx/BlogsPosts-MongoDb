import { Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {BlogInputDto} from "../../dtoBlogs/blog-input-dto";
import {Blog} from "../../typesBlogs/blog";
import {blogsRepository} from "../../repositoriesBlogs/blogs.repository";
import {mapToBlogViewModel} from "../mappers/map-to-blog-view-model.util";

export async function createBlogHandler(
    req: Request<{}, {}, BlogInputDto>,
    res: Response,
) {

    try {
        const newBlog: Blog = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const createdBlog = await blogsRepository.createBlog(newBlog);
        const blogViewModel = mapToBlogViewModel(createdBlog);
        res.status(HttpStatus.Created).send(blogViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}