import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { PostInputDTO } from "../../../src/posts/dtoPosts/post-input-dto";
import { HttpStatus } from "../../../src/core/typesAny/http-statuses";
import { Blog } from "../../../src/blogs/typesBlogs/blog";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {clearDb} from "../../utils/clear-db";

describe('Posts API (e2e)', () => {
    const app = express();
    setupApp(app);
    const adminToken = generateBasicAuthToken();


    let newBlog: Blog;

    const correctPostInput: PostInputDTO = {
        title: 'NewJeans all music',
        shortDescription: 'Super Shy',
        content: 'music',
        blogId: '', // заполним после создания блога
    };

    beforeAll(async () => {
        // чистим базу
        await clearDb(app)

        // создаём блог для тестов
        const blogResponse = await request(app)
            .post('/api/blogs')
            .set('Authorization', adminToken)
            .send({
                name: "K-pop Blog",
                description: "All about NewJeans",
                websiteUrl: "https://newjeans.kr",
            })
            .expect(HttpStatus.Created);

        newBlog = blogResponse.body;
        correctPostInput.blogId = newBlog.id; // теперь blogId точно существует
    });

    it('Should create a new post if blog exists', async () => {
        const newPostInput: PostInputDTO = {
            title: 'NewJeans all music',
            shortDescription: 'Super Shy',
            content: 'music',
            blogId: newBlog.id,
        };

        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .send(newPostInput)
            .expect(HttpStatus.Created);

        expect(response.body).toEqual({
            id: expect.any(String),
            title: newPostInput.title,
            shortDescription: newPostInput.shortDescription,
            content: newPostInput.content,
            blogId: newBlog.id,
            blogName: newBlog.name,
        });
    });

    it('Should return 404 if blog does not exist', async () => {
        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .set('Authorization', adminToken)
            .send({
                title: 'Test Post',
                shortDescription: 'Short desc',
                content: 'Some content',
                blogId: '99999', // несуществующий блог
            })
            .expect(HttpStatus.NotFound);

        expect(response.body.message).toBe('Blog with id=99999 not found');
    });

    it('Should return list of posts', async () => {
        await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .send({ ...correctPostInput, title: 'Itzy' })
            .expect(HttpStatus.Created);

        await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .send({ ...correctPostInput, title: 'Aespa' })
            .expect(HttpStatus.Created);

        const postsListResponse = await request(app)
            .get('/api/posts') // 👈 исправленный путь
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(Array.isArray(postsListResponse.body)).toBe(true);
        expect(postsListResponse.body.length).toBeGreaterThanOrEqual(2);
    });

    it('Should return post by Id', async () => {
        const createResponse = await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .send({ ...correctPostInput, title: 'IU singer' })
            .expect(HttpStatus.Created);

        const getResponse = await request(app)
            .get(`/api/posts/${createResponse.body.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(getResponse.body).toEqual({
            ...createResponse.body,
            id: expect.any(String),
        });
    });

    it('Should update post, PUT', async () => {
        const createResponse = await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .send({ ...correctPostInput, title: 'IU singer' })
            .expect(HttpStatus.Created);

        const postInput: PostInputDTO = {
            title: 'NewJeans music',
            shortDescription: 'Cool with you',
            content: 'music',
            blogId: newBlog.id,
        };

        await request(app)
            .put(`/api/posts/${createResponse.body.id}`)
            .set('Authorization', adminToken)
            .send(postInput)
            .expect(HttpStatus.NoContent);

        const postResponse = await request(app)
            .get(`/api/posts/${createResponse.body.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(postResponse.body).toEqual({
            ...postInput,
            id: createResponse.body.id,
            blogName: newBlog.name,
        });
    });

    it('Should delete post', async () => {
        const createResponse = await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .send({ ...correctPostInput, title: 'IU singer' })
            .expect(HttpStatus.Created);

        await request(app)
            .delete(`/api/posts/${createResponse.body.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

        const postResponse = await request(app)
            .get(`/api/posts/${createResponse.body.id}`)
            .set('Authorization', adminToken)
        expect(postResponse.status).toBe(HttpStatus.NotFound);
    });
});
