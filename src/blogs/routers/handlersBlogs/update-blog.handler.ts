import { Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {BlogInputDto} from "../../dtoBlogs/blog-input-dto";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {blogsRepository} from "../../repositoriesBlogs/blogs.repository";
import { vehicleInputDtoValidationBlogs } from "../../validationBlogs/vehicleInputDtoValidationBlogs";

export async function updateBlogHandler(
    req: Request<{id: string},{},BlogInputDto>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const blog = await blogsRepository.findBlogById(id)

        if (!blog) {
            res.status(HttpStatus.NotFound).send(createErrorMessages([{
                field: 'id',
                message: 'Blog not found'
            }]))
            return;
        }

       await blogsRepository.updateBlog(id, req.body);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}