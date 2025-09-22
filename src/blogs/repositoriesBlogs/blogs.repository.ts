import { Blog } from "../typesBlogs/blog";
import { BlogInputDto } from "../dtoBlogs/blog-input-dto";
import {dbBlogs} from "../../db/in-memory.db";

export const blogsRepository = {
    findAllBlogs(): Blog[] {
        return dbBlogs.blogs;
    },

    findBlogById(id: string): Blog | null {
        return dbBlogs.blogs.find((b) => b.id===id) ?? null;
    },

    createBlog(newBlog: Blog): Blog{
        dbBlogs.blogs.push(newBlog);

        return newBlog;
    },

    updateBlog(id: string, dto: BlogInputDto): void {
        const blog = dbBlogs.blogs.find((b) => b.id===id);

        if(!blog) {
            throw new Error("Blog not found.");
        }

        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;

        return;
    },

    deleteBlog(id: string): void {
        const index = dbBlogs.blogs.findIndex((b) => b.id===id);

        if(index === -1) {
            throw new Error("Blog not found.");
        }

        dbBlogs.blogs.splice(index, 1);
        return;
    },
};