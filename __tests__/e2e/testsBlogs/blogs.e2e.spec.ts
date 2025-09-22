import request from 'supertest';
import express from 'express';
import {setupApp} from "../../../src/setup-app";
import {BlogInputDto} from "../../../src/blogs/dtoBlogs/blog-input-dto";
import {HttpStatus} from "../../../src/core/typesAny/http-statuses";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {clearDb} from "../../utils/clear-db";

describe('Trying to set up Blogs API ', () => {
    const app = express();
    setupApp(app);

    const adminToken = generateBasicAuthToken();

const testBlogData: BlogInputDto = {
 name: 'Nikita',
    description: 'the new blog about API',
    websiteUrl: 'https://youtube.com/watch'
}
    beforeAll(async () => {
        await clearDb(app)
    });

it('Should create a new blog POST request', async () => {
    const newBlogInput: BlogInputDto = {
        name: 'Bob',
        description: 'Bob`s new blog about k-pop',
        websiteUrl: 'https://www.youtube.com/watch',
    };
    await request(app)
        .post('/api/blogs')
        .set('Authorization', adminToken)
        .send(newBlogInput)
        .expect(HttpStatus.Created);
});

it('Should return blogs list of blogs', async () => {
    await request(app)
        .post('/api/blogs')
        .set('Authorization', adminToken)
        .send({...testBlogData, name: 'Nikita1'})
        .expect(HttpStatus.Created);

    await request(app)
        .post('/api/blogs')
        .set('Authorization', adminToken)
        .send({...testBlogData, name: 'Nikita2'})
        .expect(HttpStatus.Created);

    const blogsListResponse = await request(app)
        .get('/api/blogs')
        .set('Authorization', adminToken)
        .expect(HttpStatus.Ok);

    expect(blogsListResponse.body).toBeInstanceOf(Array);
    expect(blogsListResponse.body.length).toBeGreaterThanOrEqual(2);

});

    it('Should return blog by Id', async () => {
        const createResponse = await request(app)
            .post('/api/blogs')
            .set('Authorization', adminToken)
            .send({...testBlogData, name: 'Nikita1'})
            .expect(HttpStatus.Created);

        const getResponse = await request(app)
            .get(`/api/blogs/${createResponse.body.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(getResponse.body).toEqual({
            ...createResponse.body,
            id: expect.any(String),
        });
    });

it('Should update a blog, PUT', async () => {
    const createResponse = await request(app)
    .post('/api/blogs')
        .set('Authorization', adminToken)
        .send({...testBlogData, name: 'Nikita1'})
        .expect(HttpStatus.Created);

    const blogInput: BlogInputDto = {
        name: 'New UpdateName',
        description: 'NewName`s new blog about k-pop',
        websiteUrl: 'https://www.youtube.com/watch/api/blogs',
    };

    await request(app)
        .put(`/api/blogs/${createResponse.body.id}`)
        .set('Authorization', adminToken)
        .send(blogInput)
        .expect(HttpStatus.NoContent);

    const blogResponse = await request(app)
        .get(`/api/blogs/${createResponse.body.id}`)
.set('Authorization', adminToken)
    expect(blogResponse.body).toEqual({...blogInput,
    id: createResponse.body.id})
});

it('Delete', async () => {
    const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', adminToken)
        .send({...testBlogData, name: 'Nikita3'})
        .expect(HttpStatus.Created);

    await request(app)
        .delete(`/api/blogs/${response.body.id}`)
        .set('Authorization', adminToken)
        .expect(HttpStatus.NoContent);

    const blogResponse = await request(app)
        .get(`/api/blogs/${response.body.id}`)
        .set('Authorization', adminToken)
        expect(blogResponse.status).toBe(HttpStatus.NotFound);
});
});

