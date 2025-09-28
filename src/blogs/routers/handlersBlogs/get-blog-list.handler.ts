import {Request,Response} from "express";
import {blogsRepository} from "../../repositoriesBlogs/blogs.repository";
import {mapToBlogViewModel} from "../mappers/map-to-blog-view-model.util";
import {HttpStatus} from "../../../core/typesAny/http-statuses";

export async function getBlogListHandler(_req: Request, res: Response) {
    try {
        const blogs = await blogsRepository.findAllBlogs();
        const blogViewModel = blogs.map(mapToBlogViewModel);
        res.send(blogViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}