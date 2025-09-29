import request from "supertest";
import express from "express";
import {setupApp} from "../../../src/setup-app";
import {BlogInputDto} from "../../../src/blogs/dtoBlogs/blog-input-dto";
import {HttpStatus} from "../../../src/core/typesAny/http-statuses";
import {clearDb} from "../../utils/clear-db";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {runDB, stopDb} from "../../../src/db/mongo.db";

describe('Blogs API validation tests', () => {
    const app = express();
    setupApp(app);
    const adminToken = generateBasicAuthToken();

    const correctBlogTestData: BlogInputDto = {
        name: 'Daniel',
        description: 'NewJeans OMG',
        websiteUrl: 'https://www.newjeans.com/kpop',
    };

    beforeAll(async () => {
        await runDB('mongodb+srv://nik:nik@lesson.mezyenu.mongodb.net/blogspostsapp?retryWrites=true&w=majority');
        await clearDb(app)
    });

    afterAll(async () => {
        await stopDb();
    });

    it('Example: if incorrect entered data', async () => {
        const invalidData1 = await request(app)
            .post('/blogs')
            .set('Authorization', adminToken)


            .send({
                ...correctBlogTestData,
                name: '',
                description: '',
                websiteUrl: ''
            })
        .expect(HttpStatus.BadRequest);

        expect(invalidData1.body.errorsMessages).toHaveLength(3);
    });

    it('Example: incorrect name invalid data', async () => {
       const incalidData2 = await request(app)
        .post('/blogs')
           .set('Authorization', adminToken)

           .send({
                ...correctBlogTestData,
                name: '1234567890123456',
                description: 'Name uncorrect',
                websiteUrl: 'https://www.newjeans.com/kpop'
            })
           .expect(HttpStatus.BadRequest);

       expect(incalidData2.body.errorsMessages).toHaveLength(1);
    });


});

