import {Request,Response} from "express";
import {blogsRepository} from "../../repositoriesBlogs/blogs.repository";

export function getBlogListHandler(_req: Request, res: Response) {
    const blogs = blogsRepository.findAllBlogs();
    res.send(blogs);
}