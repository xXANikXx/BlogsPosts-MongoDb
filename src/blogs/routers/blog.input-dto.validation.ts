import {body} from 'express-validator';

const nameValidation = body ('name')
.isString()
.withMessage('name should be a string')
.trim()
.isLength({min: 1, max: 15})
    .withMessage('Length of name is not correct');

const descriptionValidation = body ('description')
.isString()
.withMessage('Description should be a string')
.trim()
.isLength({min: 1, max: 500})
.withMessage('Length of description is not correct');

const websiteValidation = body ('websiteUrl')
.isString()
.withMessage('Website should be a string')
.trim()
.isLength({min: 5, max: 100})
.withMessage('Length of website is not correct')
.isURL({protocols: ['https'], require_protocol: true})
.withMessage('URL should be a Valid HTTPS URL');


export const blogInputDtoValidation = [
    nameValidation,
    descriptionValidation,
    websiteValidation,
];