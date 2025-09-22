import {Router} from "express";
import {getBlogListHandler} from "./handlersBlogs/get-blog-list.handler";
import {getBlogHandler} from "./handlersBlogs/get-blog.handler";
import {createBlogHandler} from "./handlersBlogs/create-blog.handler";
import {updateBlogHandler} from "./handlersBlogs/update-blog.handler";
import {deleteBlog} from "./handlersBlogs/delete-blog.handler";
import {
    idValidation
} from "../../core/middlewares/validation/input_validation-result.middleware";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/validation/params-id.validation-middleware";
import {
    blogInputDtoValidation
} from "../validationBlogs/blog.input-dto.validation";
import {
    superAdminGuardMiddleware
} from "../../../auth/middlewares/super-admin.guard-middleware";

export const blogsRouter = Router({});

blogsRouter
    .get("/", getBlogListHandler)

    .get('/:id', idValidation, inputValidationResultMiddleware,getBlogHandler)

    .post('/', superAdminGuardMiddleware,blogInputDtoValidation, inputValidationResultMiddleware,createBlogHandler)

    .put('/:id', superAdminGuardMiddleware,idValidation, blogInputDtoValidation, inputValidationResultMiddleware,updateBlogHandler)

    .delete('/:id', superAdminGuardMiddleware,idValidation, inputValidationResultMiddleware,deleteBlog);