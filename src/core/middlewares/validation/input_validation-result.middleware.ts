import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../typesAny/http-statuses";
import { ValidationErrorType } from "../../typesAny/validationError";
import { ValidationErrorOutput } from "../../typesAny/validationError.dto";
import {
    FieldValidationError,
    ValidationError,
    validationResult
} from "express-validator";


export const createErrorMessages = (
    errors: ValidationErrorType[],
): ValidationErrorOutput => {
    return { errorsMessages: errors };
};

const formatValidationErrors =
    (error: ValidationError): ValidationErrorType => {
        const expressError = error as unknown as FieldValidationError;

        return {
            field: expressError.path,
            message: expressError.msg,
        };
    };

export const inputValidationResultMiddleware = (
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction,
) => {

    // console.log('QUERY PARAMS:', req.query);
    // console.log('BODY:', req.body);
    // console.log('PARAMS:', req.params);


    const errors = validationResult(req)
        .formatWith(formatValidationErrors).
        array({ onlyFirstError: true });

    if (errors.length > 0) {
        // console.log('VALIDATION ERRORS:', errors);
        res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
        return;
    }

    next();
};
