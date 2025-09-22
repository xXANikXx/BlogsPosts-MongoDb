import { Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {BlogInputDto} from "../../dtoBlogs/blog-input-dto";
import {dbBlogs} from "../../../db/in-memory.db";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {Blog} from "../../typesBlogs/blog";
import {blogsRepository} from "../../repositoriesBlogs/blogs.repository";
import { vehicleInputDtoValidationBlogs } from "../../validationBlogs/vehicleInputDtoValidationBlogs";
import {BlogViewDto} from "../../dtoBlogs/blog-view-dto";
import {generateId} from "../../../core/utils/generateId";

export function createBlogHandler(
    req: Request<{}, {}, BlogInputDto>,
    res: Response,
) {
    const errors = vehicleInputDtoValidationBlogs(req.body);

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
    }

    const newBlog: Blog = {
        id: generateId(),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl

    }

    blogsRepository.createBlog(newBlog);

    const response: BlogViewDto = newBlog

    res.status(HttpStatus.Created).send(response);
}