import request from 'supertest';
import { Express } from 'express';
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/typesAny/http-statuses";
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { BlogOutput } from '../../../src/blogs/routers/output/blog.output';



export async function getBlogById(
    app: Express,
    blogId: string,
): Promise<BlogOutput> {
    const blogResponse = await request(app)
        .get(`${BLOGS_PATH}/${blogId}`)
        .set('Authorization', generateBasicAuthToken())
        .expect(HttpStatus.Ok);

    return blogResponse.body;
}