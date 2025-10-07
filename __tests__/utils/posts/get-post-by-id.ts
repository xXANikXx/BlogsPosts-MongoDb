import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/typesAny/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { PostOutput } from '../../../src/posts/routers/output/post.output';

export async function getPostById(
    app: Express,
    postId: string,
): Promise<PostOutput> {
    const getResponse = await request(app)
        .get(`${POSTS_PATH}/${postId}`)
        .set('Authorization', generateBasicAuthToken())
        .expect(HttpStatus.Ok);

    return getResponse.body;
}