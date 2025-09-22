import { Router, Request, Response } from 'express';
import { dbBlogs, dbPosts } from "../../db/in-memory.db";
import { HttpStatus } from "../../core/typesAny/http-statuses"

export const testingRouter = Router({});

testingRouter.delete("/all-data", (_req: Request, res: Response) => {
    dbBlogs.blogs.length = 0; // очистили блогов
    dbPosts.posts.length = 0; // очистили посты
    res.sendStatus(HttpStatus.NoContent);
});