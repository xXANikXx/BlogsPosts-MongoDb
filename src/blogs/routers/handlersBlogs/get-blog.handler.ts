import { Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {blogsRepository} from "../../repositoriesBlogs/blogs.repository";

export async function getBlogHandler(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const blog = blogsRepository.findBlogById(id);

        if (!blog) {
            res.status(HttpStatus.NotFound).send(createErrorMessages([{
                field: 'id',
                message: 'Blog not found'
            }]));
            return;
        }
        res.send(blog);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}