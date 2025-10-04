import { Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {BlogUpdateInput} from "../input/blog-update.input";
import {blogsService} from "../../application/blogs.service";
import {errorHandler} from "../../../core/errors/errors.handler";

export async function updateBlogHandler(
    req: Request<{id: string},{},BlogUpdateInput>,
    res: Response,
) {
    try {
        const id = req.params.id;


       await blogsService.updateBlog(id, req.body);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}