import { body, param } from 'express-validator';

const titleValidation = body('title')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Length of title is not correct')

const shortDescriptionValidation = body('shortDescription')
    .isString()
    .withMessage('ShortDescription must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Length of shortDescription is not correct')

const contentValidation = body('content')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Length of content is not correct')

const blogIdValidation = body('blogId')
    .isString()
    .withMessage('BlogId must be a string')
    .trim()
    .notEmpty()
    .withMessage('BlogId should not be empty');

export const blogIdParamValidation = param('id')
    .isString()
    .withMessage('BlogId must be a string')
    .trim()
    .notEmpty()
    .withMessage('BlogId must be a string');

export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];

export const createPostByBlogValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdParamValidation,
];