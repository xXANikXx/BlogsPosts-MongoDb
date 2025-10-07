import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/typesAny/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { getBlogDto } from './get-blog-dto';
import { BlogOutput } from '../../../src/blogs/routers/output/blog.output';
import { BlogUpdateInput } from '../../../src/blogs/routers/input/blog-update.input';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';

export async function updateBlog(
    app: Express,
    blogId: string,
    blogDto: BlogUpdateInput,
): Promise<BlogOutput> {
    const updateBlogResponse = await request(app)
        .put(`${BLOGS_PATH}/${blogId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(blogDto)
        .expect(HttpStatus.Ok); // 201

    return updateBlogResponse.body;
}