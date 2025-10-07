import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { HttpStatus } from "../../../src/core/typesAny/http-statuses";
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { POSTS_PATH } from "../../../src/core/paths/paths";

describe('Trying to set up Posts API', () => {
    const app = express();
    setupApp(app);
    const adminToken = generateBasicAuthToken();

    beforeAll(async () => {
        await runDB('mongodb+srv://nik:nik@lesson.mezyenu.mongodb.net/blogspostsapp?retryWrites=true&w=majority');
        await request(app)
            .delete('/testing/all-data')
            .expect(HttpStatus.NoContent);
    });

    afterAll(async () => {
        await stopDb();
    });

    it('Example: if incorrect entered data', async () => {
        const invalidPostData1 = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({})
            .expect(HttpStatus.BadRequest);

        const invalidDataSet1 = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', adminToken)
            .send({
                title: 'Black',
                shortDescription: 'Pink',
                content: 'Music',
                blogId: 2,
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorsMessages).toHaveLength(1);
    })


})