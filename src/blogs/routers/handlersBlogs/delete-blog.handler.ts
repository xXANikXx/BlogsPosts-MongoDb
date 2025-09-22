import { Request, Response } from "express";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { blogsRepository } from "../../repositoriesBlogs/blogs.repository";

export function deleteBlog(req: Request, res: Response) {
    const id = req.params.id;
    const blog = blogsRepository.findBlogById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(createErrorMessages([{ field: "id", message: "Blog not found" }]));
        return;
    }

    blogsRepository.deleteBlog(id);
    res.sendStatus(HttpStatus.NoContent);
}
