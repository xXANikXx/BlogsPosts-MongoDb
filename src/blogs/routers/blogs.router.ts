import { Router } from "express";
import { getBlogListHandler } from "./handlersBlogs/get-blog-list.handler";
import { getBlogHandler } from "./handlersBlogs/get-blog.handler";
import { createBlogHandler } from "./handlersBlogs/create-blog.handler";
import { updateBlogHandler } from "./handlersBlogs/update-blog.handler";
import { deleteBlogHandler } from "./handlersBlogs/delete-blog.handler";
import { getBlogPostListHandler } from "./handlersBlogs/get-blog-post-list.handler";

import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/validation/input_validation-result.middleware";
import {
    blogInputDtoValidation
} from "./blog.input-dto.validation";
import {
    superAdminGuardMiddleware
} from "../../auth/middlewares/super-admin.guard-middleware";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { PostSortField } from "../../posts/routers/input/post-soft-field";
import { BlogSortField } from "./input/blog-soft-field";
import {
    createPostByBlogHandler
} from "./handlersBlogs/post-blog-post-list.handler";
import { createPostByBlogValidation } from "../../posts/routers/post.input-dto.validation";

export const blogsRouter = Router({});

blogsRouter
    .get("/", paginationAndSortingValidation(BlogSortField), getBlogListHandler, inputValidationResultMiddleware)

    .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)

    .post('/', superAdminGuardMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, createBlogHandler)

    .put('/:id', superAdminGuardMiddleware, idValidation, blogInputDtoValidation, inputValidationResultMiddleware, updateBlogHandler)

    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deleteBlogHandler)

    .get('/:id/posts', idValidation, paginationAndSortingValidation(PostSortField), inputValidationResultMiddleware, getBlogPostListHandler)

    .post('/:id/posts', superAdminGuardMiddleware, idValidation, createPostByBlogValidation, inputValidationResultMiddleware, createPostByBlogHandler)