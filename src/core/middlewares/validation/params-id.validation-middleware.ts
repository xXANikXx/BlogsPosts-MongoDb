import { body, param } from 'express-validator';

export const idValidation = param('id')
    .exists()
    .withMessage('Id is required')
    .isString()
    .withMessage('Id must be a string')
    .isMongoId()
    .withMessage('Id incorrect format ObjectId')
