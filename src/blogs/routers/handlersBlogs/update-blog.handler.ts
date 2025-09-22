import { Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {BlogInputDto} from "../../dtoBlogs/blog-input-dto";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {blogsRepository} from "../../repositoriesBlogs/blogs.repository";
import { vehicleInputDtoValidationBlogs } from "../../validationBlogs/vehicleInputDtoValidationBlogs";

export function updateBlogHandler(
    req: Request<{id: string},{},BlogInputDto>,
    res: Response,
) {
    const id = req.params.id;
    const errors = vehicleInputDtoValidationBlogs(req.body);
    if(errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
    }
    const blog = blogsRepository.findBlogById(id);
    if(!blog) {
        res.status(HttpStatus.NotFound).send(createErrorMessages([{field: 'id', message: 'Blog not found'}]))
    return;
    }

    blogsRepository.updateBlog(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
}