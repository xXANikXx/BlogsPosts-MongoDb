import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/typesAny/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { PostOutput } from '../../../src/posts/routers/output/post.output';
import { getPostDto } from './get-post-dto';
import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';
import { createBlog } from '../blogs/create-blog';


export async function createPost(
    app: Express,
    postDto?: PostAttributes,
): Promise<PostOutput> {
    const blog = await createBlog(app);

    // Генерируем тестовые данные поста
    const testPostData: PostAttributes = getPostDto(blog.id);

    // Если передан postDto, перезаписываем поля
    const finalPostData = { ...testPostData, ...postDto };

    // Делаем POST-запрос на создание поста
    const createPostResponse = await request(app)
        .post(POSTS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(finalPostData)
        .expect(HttpStatus.Created); // 201

    return createPostResponse.body;

}