import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/typesAny/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { getBlogDto } from './get-blog-dto';
import { BlogOutput } from '../../../src/blogs/routers/output/blog.output';
import { BlogCreateInput } from '../../../src/blogs/routers/input/blog-create.input';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';

export async function createBlog(
    app: Express,
    blogDto?: BlogAttributes,
): Promise<BlogOutput> {
    const testBlogData: BlogCreateInput = {
        ...getBlogDto(),
        ...blogDto,
    };

    const createdBlogResponse = await request(app)
        .post(BLOGS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(testBlogData)
        .expect(HttpStatus.Created); // 201

    return createdBlogResponse.body;
}