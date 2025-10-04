import { Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {blogsService} from "../../application/blogs.service";
import {errorHandler} from "../../../core/errors/errors.handler";
import {mapToBlogOutput} from "../mappers/map-to-blog-output.utill";

export async function getBlogHandler(req: Request <{ id: string }>, res: Response,) {
    try {
        const id = req.params.id;

        const blog = await blogsService.findByIdOrFail(id)

        const blogOutput = mapToBlogOutput(blog)

        res.status(HttpStatus.Ok).send(blogOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}