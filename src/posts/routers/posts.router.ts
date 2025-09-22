import {Router} from "express";
import {getPostListHandler} from "./handlersPosts/get-post-list.handler";
import {getPostHandler} from "./handlersPosts/get-post.handler";
import {createPostHandler} from "./handlersPosts/create-post.handler";
import {updatePostHandler} from "./handlersPosts/update-post.handler";
import {deletePost} from "./handlersPosts/delete-post.handler";
import {
    idValidation
} from "../../core/middlewares/validation/input_validation-result.middleware";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/validation/params-id.validation-middleware";
import {
    postInputDtoValidation
} from "../validationPosts/post.input-dto.validation";
import {
    superAdminGuardMiddleware
} from "../../../auth/middlewares/super-admin.guard-middleware";


export const postsRouter = Router({});

postsRouter
    .get('/', getPostListHandler)

    .get('/:id' ,idValidation, inputValidationResultMiddleware, getPostHandler)

    .post('/', superAdminGuardMiddleware,postInputDtoValidation, inputValidationResultMiddleware,createPostHandler)

    .put('/:id', superAdminGuardMiddleware,idValidation,postInputDtoValidation, inputValidationResultMiddleware,updatePostHandler)

    .delete('/:id', superAdminGuardMiddleware,idValidation, inputValidationResultMiddleware, deletePost);