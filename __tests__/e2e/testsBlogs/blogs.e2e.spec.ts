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
import { BlogOutput } from '../../../src/blogs/routers/output/blog.output';

let createdBlogs: BlogOutput[] = [];

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

    it('should check query validation manually', async () => {


        // пробуем заведомо неправильный запрос
        const response = await request(app)
            .get('/blogs')
            .query({
                pageNumber: 'abc',
                sortDirection: 'wrong',
                sortBy: 'name',
                pageSize: 5,
                searchNameTerm: 'Tim',
            });

        console.log('STATUS:', response.status);
        console.log('BODY:', response.body);

        expect(response.status).toBe(400); // или 400, если тестируешь ошибку
        expect(response.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'sortDirection',
                    message: 'Sort direction must be one of: asc, desc',
                }),]),
        );
    });


    it('should create 12 blogs (4 matching "Tim", 8 non-matching)', async () => {
        const blogNamesToMatch = ['Tim', 'Tima', 'Timma', 'Timm'];
        const blogNamesToExclude = ['Alex', 'Alexey', 'Andrey', 'Dima', 'Don', 'Zebra', 'Apple', 'Banana'];

        // Создаем все блоги
        for (const name of [...blogNamesToMatch, ...blogNamesToExclude]) {
            const blog = await createBlog(app, {
                ...getBlogDto(), // базовые поля
                name,            // заменяем только имя
            });
            createdBlogs.push(blog);
        }

        expect(createdBlogs.length).toBe(12);
    });


    // Воспроизводим проблемный GET-запрос
    it('should return 4 blogs, filtered by "Tim" and sorted by "name" ascending', async () => {
        const queryParams = 'pageSize=5&pageNumber=1&searchNameTerm=Tim&sortDirection=asc&sortBy=name';

        const expectedItems = createdBlogs
            .filter(b => b.name.toLowerCase().includes('tim')) // Имитация фильтра
            .sort((a, b) => a.name.localeCompare(b.name))      // Имитация сортировки по имени asc
            .map(b => ({
                // Оставляем только те поля, которые проверяются
                id: b.id,
                name: b.name,
                description: b.description,
                websiteUrl: b.websiteUrl,
                createdAt: b.createdAt,
                isMembership: b.isMembership
            }));

        const expectedOutput = {
            pagesCount: 1,      // 4 / 5 = 1
            page: 1,
            pageSize: 5,
            totalCount: 4,      // Ожидаемый totalCount
            items: expectedItems.slice(0, 5), // Первые 5 (все 4) элемента
        };


        const response = await request(app)
            .get(`${BLOGS_PATH}?${queryParams}`)
            .expect(HttpStatus.Ok);

        const receivedData = response.body;

        console.log('--- E2E Debug Output ---');
        console.log('Received Total Count:', receivedData.totalCount);
        console.log('Received Items (Names):', receivedData.items.map((i: any) => i.name));
        console.log('-------------------------');


        // 1. Проверяем, что фильтр СРАБОТАЛ (totalCount=4)
        expect(receivedData.totalCount).toBe(expectedOutput.totalCount);
        expect(receivedData.pagesCount).toBe(expectedOutput.pagesCount);

        // 2. Проверяем, что сортировка и пагинация СРАБОТАЛИ
        expect(receivedData.items.length).toBe(expectedOutput.items.length);

        // Используем 'toEqual' для сравнения структуры и порядка
        // ВНИМАНИЕ: createdAt и ID будут отличаться, поэтому нужно сравнивать только ключевые поля
        const receivedNames = receivedData.items.map((i: any) => i.name);
        const expectedNames = expectedOutput.items.map((i: any) => i.name);

        expect(receivedNames).toEqual(expectedNames);
    });


    it("should return blogs with correct pagination meta", async () => {
        // 1️⃣ создаём 12 блогов для проверки
        for (let i = 1; i <= 12; i++) {
            await request(app)
                .post("/blogs")
                .auth("admin", "qwerty")
                .send({
                    name: `Blog ${i}`,
                    description: "desc",
                    websiteUrl: "https://example.com",
                })
                .expect(201);
        }

        // 2️⃣ получаем список без queryParams
        const response = await request(app)
            .get("/blogs")
            .expect(200);

        // 3️⃣ проверяем структуру
        const body = response.body;
        expect(body).toHaveProperty("pagesCount");
        expect(body).toHaveProperty("page");
        expect(body).toHaveProperty("pageSize");
        expect(body).toHaveProperty("totalCount");
        expect(body).toHaveProperty("items");

        // 4️⃣ убеждаемся, что pagination рассчиталась корректно
        expect(body.totalCount).toBe(12);
        expect(body.page).toBe(1);
        expect(body.pageSize).toBe(10);
        expect(body.pagesCount).toBe(2);
        expect(Array.isArray(body.items)).toBe(true);
        expect(body.items.length).toBe(10);
    });

});
