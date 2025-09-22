import { Post } from "../typesPosts/post";
import {dbBlogs, dbPosts} from "../../db/in-memory.db";
import {PostInputDTO} from "../dtoPosts/post-input-dto";
import {Blog} from "../../blogs/typesBlogs/blog";

export const postsRepository = {
    findAllPosts(): Post[] {
        return dbPosts.posts;
    },

    findPostById(id: string): Post | null {
        return dbPosts.posts.find((p) => p.id === id) ?? null;
    },

    createPost(newPost: Post): Post{
        dbPosts.posts.push(newPost);

        return newPost;
    },

    updatePost(id: string, dto: PostInputDTO): void {
        const post = dbPosts.posts.find((p) => p.id===id);

        if(!post) {
            throw new Error("Post not found.");
        }

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = dto.blogId;

        return;
    },

    deletePost(id: string): void {
        const index = dbPosts.posts.findIndex((p) => p.id === id);

        if(index === -1) {
            throw new Error("Post not found.");
        }

        dbPosts.posts.splice(index, 1);
        return;
    },
};