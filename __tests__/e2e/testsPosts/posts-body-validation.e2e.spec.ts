import request from "supertest";
import express from "express";
import {setupApp} from "../../../src/setup-app";
import {PostInputDTO} from "../../../src/posts/dtoPosts/post-input-dto";
import {HttpStatus} from "../../../src/core/typesAny/http-statuses";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";

describe('Trying to set up Posts API', () => {
    const app = express();
    setupApp(app);
    const adminToken = generateBasicAuthToken();

    const correctPostTestData: PostInputDTO = {
        title: 'Post about BlackPink',
        shortDescription: 'BlackPink',
        content: 'In your area',
        blogId: '1',
    };

    beforeAll(async () => {
        await request(app)
            .delete('/api/testing/all-data')
            .expect(HttpStatus.NoContent);
    });

    it('Example: if incorrect entered data', async () => {
        const invalidPostData1 = await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .send({
                ...correctPostTestData,
                title: '',
                shortDescription: '',
                content: '',
                blogId: '',
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidPostData1.body.errorsMessages).toHaveLength(4);
    })

    it('Example: if incorrect invalid blogId', async () => {
        const invalidPostData2 = await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .send({
                ...correctPostTestData,
                title: 'Black',
                shortDescription: 'Pink',
                content: 'Music',
                blogId: 2,
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidPostData2.body.errorsMessages).toHaveLength(1);
    });

    it('Example: BlogId don`t exist', async () => {
        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', adminToken)
            .send({
                ...correctPostTestData,
                blogId: '99999', // строка, но блога с таким id нет
            })
            .expect(HttpStatus.NotFound);

        expect(response.body.message).toBe('Blog with id=99999 not found');
    })

})