import {body, param} from 'express-validator';

export const idValidation = param('id')
.exists()
.withMessage('Id is required')
.isString()
.withMessage('Id must be a string')
.isMongoId()
.withMessage('Id incorrect format ObjectId')

export const dataIdMatchValidation = body('data.id')
.exists()
.withMessage('Id in body is required')
.custom((value, { req}) => {
    if (value !== req?.params?.id){
        throw new Error('Id in URL and body must match');
    }
    return true;
})