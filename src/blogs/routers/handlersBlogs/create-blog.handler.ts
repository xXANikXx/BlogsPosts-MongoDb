import { Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";
import {BlogCreateInput} from "../input/blog-create.input";
import {blogsService} from "../../application/blogs.service";
import {mapToBlogOutput} from "../mappers/map-to-blog-output.utill";

export async function createBlogHandler(
    req: Request<{}, {}, BlogCreateInput>,
    res: Response,
) {

    try {
        const createBlogId = await blogsService.createBlog(req.body);

        const createdBlog = await blogsService.findByIdOrFail(createBlogId);
        const blogOutput = mapToBlogOutput(createdBlog);

        res.status(HttpStatus.Created).send(blogOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}