import { PostQueryInput } from "../routers/input/post-query.input";
import { WithId } from "mongodb";
import { Post } from "../domain/post";
import { postsRepository } from "../repositoriesPosts/posts.repository";
import { PostAttributes } from "./dtos/post-attributes";
import { blogsRepository } from "../../blogs/repositoriesBlogs/blogs.repository";


export const postService = {
    async findMany(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        return postsRepository.findMany(queryDto)
    },

    async findPostsByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {


        await blogsRepository.findByIdOrFail(blogId);
        return postsRepository.findPostsByBlog(queryDto, blogId);
    },

    async findByIdOrFail(id: string): Promise<WithId<Post>> {
        return postsRepository.findByIdOrFail(id);
    },

    async createPostByBlog(
        dto: PostAttributes,
        blogId: string): Promise<string> {
        const blog = await blogsRepository.findByIdOrFail(blogId);

        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }
        return await postsRepository.createPost(newPost);
    },

    async createPost(dto: PostAttributes): Promise<string> {
        const blog = await blogsRepository.findByIdOrFail(dto.blogId);

        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }
        return await postsRepository.createPost(newPost);
    },

    async updatePost(id: string, dto: PostAttributes): Promise<void> {
        await postsRepository.updatePost(id, dto);
        return;
    },

    async deletePost(id: string): Promise<void> {
        await postsRepository.deletePost(id);
        return;
    },

}