import { Request, Response } from "express";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { blogsRepository } from "../../repositoriesBlogs/blogs.repository";

export async function deleteBlog(req: Request, res: Response) {

    try {
        const id = req.params.id;
        const blog = await blogsRepository.findBlogById(id);

        if (!blog) {
            res
                .status(HttpStatus.NotFound)
                .send(createErrorMessages([{
                    field: "id",
                    message: "Blog not found"
                }]));
            return;
        }

        blogsRepository.deleteBlog(id);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}