import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/typesAny/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { PostOutput } from '../../../src/posts/routers/output/post.output';
import { getPostDto } from './get-post-dto';
import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';
import { createBlog } from '../blogs/create-blog';
import { PostUpdateInput } from '../../../src/posts/routers/input/post-update.input'

export async function updatePost(
    app: Express,
    blogId: string,
    postDto: PostUpdateInput,
): Promise<PostOutput> {

    const updateBlogResponse = await request(app)
        .put(`${POSTS_PATH}/${blogId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(postDto)
        .expect(HttpStatus.Ok);

    return updateBlogResponse.body;
}