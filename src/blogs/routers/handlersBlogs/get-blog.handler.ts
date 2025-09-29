import { Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {blogsRepository} from "../../repositoriesBlogs/blogs.repository";
import {mapToBlogViewModel} from "../mappers/map-to-blog-view-model.util";

export async function getBlogHandler(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const blog = await blogsRepository.findBlogById(id);

        if (!blog) {
            res.status(HttpStatus.NotFound).send(createErrorMessages([{
                field: 'id',
                message: 'Blog not found'
            }]));
            return;
        }

        const blogViewModel = mapToBlogViewModel(blog)
        res.status(HttpStatus.Ok).send(blogViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}