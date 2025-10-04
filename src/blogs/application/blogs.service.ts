import {BlogQueryInput} from "../routers/input/blog-query.input";
import {WithId} from "mongodb";
import {Blog} from "../domain/blog";
import {blogsRepository} from "../repositoriesBlogs/blogs.repository";
import {BlogAttributes} from "./dtos/blog-attributes";


export const blogsService = {
    async findMany (
        queryDto: BlogQueryInput,
    ): Promise<{items: WithId<Blog>[]; totalCount: number}> {
        return blogsRepository.findMany(queryDto)
    },

    async findByIdOrFail(id: string): Promise<WithId<Blog>>{
        return blogsRepository.findByIdOrFail(id);
    },

    async createBlog(dto: BlogAttributes): Promise<string>{
        const newBlog: Blog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }
        return blogsRepository.createBlog(newBlog);
    },

    async updateBlog (id: string, dto: BlogAttributes): Promise<void>{
        await blogsRepository.updateBlog(id, dto);
    return;
    },

    async deleteBlog (id: string): Promise<void> {
        await blogsRepository.deleteBlog(id);
        return;
    },

}