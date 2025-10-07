import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { HttpStatus } from "../../../src/core/typesAny/http-statuses";
import { clearDb } from "../../utils/clear-db";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { BlogCreateInput } from "../../../src/blogs/routers/input/blog-create.input";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blog-attributes";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";

describe('Blogs API validation tests', () => {
    const app = express();
    setupApp(app);

    const correctTestBlogAttributes: BlogAttributes = getBlogDto();

    const adminToken = generateBasicAuthToken();


    beforeAll(async () => {
        await runDB('mongodb+srv://nik:nik@lesson.mezyenu.mongodb.net/blogspostsapp?retryWrites=true&w=majority');
        await clearDb(app)
    });

    afterAll(async () => {
        await stopDb();
    });

    it('Example: if incorrect entered data', async () => {
        const correctTestBlogData: BlogCreateInput = correctTestBlogAttributes

        await request(app)
            .post(BLOGS_PATH)
            .send(correctTestBlogData)
            .expect(HttpStatus.Unauthorized);

        const invalidDataSet1 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', generateBasicAuthToken())
            .send({
                ...correctTestBlogData,
                name: '',
                description: '',
                websiteUrl: ''
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);
    });


    it('Example: incorrect name invalid data', async () => {
        const correctTestBlogData: BlogCreateInput = correctTestBlogAttributes

        const invalidDataSet2 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', generateBasicAuthToken())
            .send({
                ...correctTestBlogData,
                name: '1234567890123456',
                description: 'Name uncorrect',
                websiteUrl: 'https://www.newjeans.com/kpop'
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);
    });


});

