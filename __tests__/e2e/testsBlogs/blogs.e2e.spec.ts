import request from 'supertest';
import express, { Express } from 'express';
import { setupApp } from "../../../src/setup-app";
import { HttpStatus } from "../../../src/core/typesAny/http-statuses";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { BLOGS_PATH, POSTS_PATH } from '../../../src/core/paths/paths';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';
import { updateBlog } from '../../utils/blogs/update-blog';
import { BlogUpdateInput } from '../../../src/blogs/routers/input/blog-update.input';
import { createPost } from '../../utils/posts/create-post';
import { PostOutput } from '../../../src/posts/routers/output/post.output';

describe('Trying to set up Blogs API', () => {
    const app = express();
    setupApp(app);
    const adminToken = generateBasicAuthToken();

    beforeAll(async () => {
        await runDB('mongodb+srv://nik:nik@lesson.mezyenu.mongodb.net/blogspostsapp?retryWrites=true&w=majority');
        await clearDb(app);
    });

    afterAll(async () => {
        await stopDb();
    });

    it('Should create a new blog POST request', async () => {
        await createBlog(app, {
            ...getBlogDto(),
            name: 'Bob',
            description: 'Bob`s new blog about k-pop',
            websiteUrl: 'https://www.youtube.com/watch',
        });
    });

    it('Should return blogs list of blogs', async () => {
        await Promise.all([createBlog(app), createBlog(app)]);

        const response = await request(app)
            .get(BLOGS_PATH)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(Array.isArray(response.body.items)).toBe(true);
        expect(response.body.items.length).toBeGreaterThanOrEqual(2);
        response.body.items.forEach((blog: { id: string }) => {
            expect(blog.id).toBeDefined();
        });
    });

    it('Should return blog by Id', async () => {
        const createdBlog = await createBlog(app);
        const createdBlogId = createdBlog.id;

        const blog = await getBlogById(app, createdBlogId);

        expect(blog).toEqual({
            id: createdBlog.id,
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean),
        });
    });

    it('Should update a blog, PUT', async () => {
        const createdBlog = await createBlog(app);
        const createdBlogId = createdBlog.id;

        const blogUpdateData: BlogUpdateInput = {
            name: 'New UpdateName',
            description: 'NewName`s new blog about k-pop',
            websiteUrl: 'https://www.youtube.com/watch/api/blogs',
        };

        await request(app)
            .put(`${BLOGS_PATH}/${createdBlogId}`)
            .set('Authorization', adminToken)
            .send(blogUpdateData)
            .expect(HttpStatus.NoContent);

        const blogResponse = await getBlogById(app, createdBlogId);

        expect(blogResponse).toEqual({
            id: createdBlogId,
            name: 'New UpdateName',
            description: 'NewName`s new blog about k-pop',
            websiteUrl: 'https://www.youtube.com/watch/api/blogs',
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean),
        });
    });

    it('Delete', async () => {
        const createdBlog = await createBlog(app);
        const createdBlogId = createdBlog.id;

        await request(app)
            .delete(`${BLOGS_PATH}/${createdBlogId}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

        await request(app)
            .get(`${BLOGS_PATH}/${createdBlogId}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NotFound);
    });

    it('Should return paginated posts for a specific blog', async () => {
        const blog = await createBlog(app);

        const totalPosts = 5;
        await Promise.all(
            Array.from({ length: totalPosts }, (_, i) =>
                createPost(app, {
                    title: `Post ${i + 1}`,
                    shortDescription: `Short ${i + 1}`,
                    content: `Content ${i + 1}`,
                    blogId: blog.id,
                })
            )
        );

        const pageNumber = 1;
        const pageSize = 5;

        const response = await request(app)
            .get(`${BLOGS_PATH}/${blog.id}/posts`)
            .query({ pageNumber, pageSize })
            .expect(HttpStatus.Ok);

        const posts: PostOutput[] = response.body.items;
        expect(posts.length).toBe(pageSize);
        posts.forEach(post => {
            expect(post.blogId).toBe(blog.id);
        });

        expect(response.body).toHaveProperty('pagesCount');
        expect(response.body).toHaveProperty('page');
        expect(response.body).toHaveProperty('pageSize');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body).toHaveProperty('items');
    });


    it('GET /blogs/:blogId/posts — should return posts with pagination', async () => {
        const createdBlog = await createBlog(app);
        const createdBlogId = createdBlog.id;

        const query = {
            pageNumber: 1,
            pageSize: 2,
            sortBy: 'createdAt',
            sortDirection: 'desc',
        };

        const response = await request(app)
            .get(`${BLOGS_PATH}/${createdBlogId}${POSTS_PATH}`)
            .query(query)
            .expect(HttpStatus.Ok);


        // проверяем базовую структуру
        expect(response.body).toHaveProperty('pagesCount');
        expect(response.body).toHaveProperty('page');
        expect(response.body).toHaveProperty('pageSize');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body).toHaveProperty('items');
        expect(Array.isArray(response.body.items)).toBe(true);

        console.log('Response:', response.body);
        expect(response.status).toBe(200);
    });

    it('GET /blogs/:blogId/posts — should return 400 on invalid query params', async () => {
        const createdBlog = await createBlog(app);
        const createdBlogId = createdBlog.id;

        const response = await request(app)
            .get(`${BLOGS_PATH}/${createdBlogId}${POSTS_PATH}`)
            .query({
                pageNumber: 'abc', // ❌ не число
                sortDirection: 'wrong', // ❌ не asc/desc
            })
            .expect(HttpStatus.BadRequest);

        expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });


    it('should return blogs with correct pagination and sorting', async () => {
        // 1. Создаём пару блогов
        await createBlog(app);
        await createBlog(app);

        // 2. Отправляем GET-запрос с пагинацией
        const res = await request(app)
            .get('/blogs')
            .query({
                pageNumber: 1,
                pageSize: 1,
                sortBy: 'createdAt',
                sortDirection: 'desc',
            })
            .expect(HttpStatus.Ok);

        // 3. Проверяем ключевые поля
        expect(res.body).toEqual(
            expect.objectContaining({
                pagesCount: expect.any(Number),
                page: 1,
                pageSize: 1,
                totalCount: expect.any(Number),
                items: expect.any(Array),
            }),
        );

        // 4. Можно проверить и конкретные значения
        expect(res.body.items.length).toBe(1);
        expect(res.body.pageSize).toBe(1);
        expect(res.body.page).toBe(1);
    });

    it('should return valid pagination response', async () => {
        const res = await request(app)
            .get('/blogs')
            .query({
                pageNumber: 1,
                pageSize: 2,
                sortBy: 'createdAt',
                sortDirection: 'desc',
            })
            .expect(HttpStatus.Ok);

        expect(res.body).toEqual(
            expect.objectContaining({
                pagesCount: expect.any(Number),
                page: 1,
                pageSize: 2,
                totalCount: expect.any(Number),
                items: expect.any(Array),
            }),
        );

        // Проверим, что ошибок нет:
        expect(res.body.errorsMessages).toBeUndefined();
    });

});
