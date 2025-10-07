import request from 'supertest';
import express from 'express';
import { setupApp } from "../../../src/setup-app";
import { HttpStatus } from "../../../src/core/typesAny/http-statuses";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { createPost } from '../../utils/posts/create-post';
import { createBlog } from '../../utils/blogs/create-blog';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { PostUpdateInput } from '../../../src/posts/routers/input/post-update.input'
import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { PostOutput } from '../../../src/posts/routers/output/post.output';
import { postCollection } from '../../../src/db/mongo.db';
import { ObjectId } from 'mongodb';

describe('Posts API (e2e)', () => {
    const app = express();
    setupApp(app);
    const adminToken = generateBasicAuthToken();

    let newBlog: any;

    beforeAll(async () => {
        await runDB('mongodb+srv://nik:nik@lesson.mezyenu.mongodb.net/blogspostsapp?retryWrites=true&w=majority');
        await clearDb(app);

        // Создаём блог для постов
        newBlog = await createBlog(app);
    });

    afterAll(async () => {
        await stopDb();
    });

    it('✅ should create a new post', async () => {
        const postInput: PostUpdateInput = {
            title: 'NewJeans music',
            shortDescription: 'Cool with you',
            content: 'Music content',
            blogId: newBlog.id,
        };

        const response = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send(postInput)
            .expect(HttpStatus.Created);

        expect(response.body).toEqual({
            id: expect.any(String),
            title: postInput.title,
            shortDescription: postInput.shortDescription,
            content: postInput.content,
            blogId: newBlog.id,
            blogName: newBlog.name,
            createdAt: expect.any(String),
        });
    });

    it('Should return 404 if blog does not exist', async () => {
        const fakeBlogId = new ObjectId().toString();

        const response = await request(app)
            .post('/posts')
            .set('Authorization', generateBasicAuthToken()) // <- добавляем авторизацию
            .send({
                title: 'Test Post',
                shortDescription: 'Short desc',
                content: 'Content here',
                blogId: fakeBlogId,
            })
            .expect(HttpStatus.NotFound);

        // 3. Проверяем тело ответа
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].message).toBe('Blog not exist');
        expect(response.body.errors[0].field).toBe('id');
    });

    it('Should return list of posts', async () => {
        // Создаём несколько постов
        await createPost(app);
        await createPost(app);

        const response = await request(app)
            .get(POSTS_PATH)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(Array.isArray(response.body.items)).toBe(true);
        expect(response.body.items.length).toBeGreaterThanOrEqual(2);

    });


    it('Should update post, PUT', async () => {
        const createdPost = await createPost(app);

        const postUpdate: PostUpdateInput = {
            title: 'Updated Title',
            shortDescription: 'Updated short',
            content: 'Updated content',
            blogId: newBlog.id,
        };

        await request(app)
            .put(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', adminToken)
            .send(postUpdate)
            .expect(HttpStatus.NoContent);

        const response = await request(app)
            .get(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(response.body).toEqual({
            id: createdPost.id,
            title: postUpdate.title,
            shortDescription: postUpdate.shortDescription,
            content: postUpdate.content,
            blogId: newBlog.id,
            blogName: newBlog.name,
            createdAt: expect.any(String),
        });
    });

    it('Should delete post', async () => {
        const createdPost = await createPost(app);

        await request(app)
            .delete(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

        await request(app)
            .get(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NotFound);
    });


    // it('Should return post by Id', async () => {
    //     const createResponse = await request(app)
    //         .post('/posts')
    //         .set('Authorization', adminToken)
    //         .send({ ...correctPostInput, title: 'IU singer' })
    //         .expect(HttpStatus.Created);

    //     const getResponse = await request(app)
    //         .get(`/posts/${createResponse.body.id}`)
    //         .set('Authorization', adminToken)
    //         .expect(HttpStatus.Ok);

    //     expect(getResponse.body).toEqual({
    //         ...createResponse.body,
    //         id: expect.any(String),
    //     });
    // });

    // it('Should update post, PUT', async () => {
    //     const createResponse = await request(app)
    //         .post('/posts')
    //         .set('Authorization', adminToken)
    //         .send({ ...correctPostInput, title: 'IU singer' })
    //         .expect(HttpStatus.Created);

    //     const postInput: PostInputDTO = {
    //         title: 'NewJeans music',
    //         shortDescription: 'Cool with you',
    //         content: 'music',
    //         blogId: newBlog.id,
    //     };

    //     await request(app)
    //         .put(`/posts/${createResponse.body.id}`)
    //         .set('Authorization', adminToken)
    //         .send(postInput)
    //         .expect(HttpStatus.NoContent);

    //     const postResponse = await request(app)
    //         .get(`/posts/${createResponse.body.id}`)
    //         .set('Authorization', adminToken)
    //         .expect(HttpStatus.Ok);

    //     expect(postResponse.body).toEqual({
    //         ...postInput,
    //         id: createResponse.body.id,
    //         blogName: newBlog.name,
    //         createdAt: expect.any(String),
    //     });
    // });

    // it('Should delete post', async () => {
    //     const createResponse = await request(app)
    //         .post('/posts')
    //         .set('Authorization', adminToken)
    //         .send({ ...correctPostInput, title: 'IU singer' })
    //         .expect(HttpStatus.Created);

    //     await request(app)
    //         .delete(`/posts/${createResponse.body.id}`)
    //         .set('Authorization', adminToken)
    //         .expect(HttpStatus.NoContent);

    //     const postResponse = await request(app)
    //         .get(`/posts/${createResponse.body.id}`)
    //         .set('Authorization', adminToken);

    //     expect(postResponse.status).toBe(HttpStatus.NotFound);
    // });
});
