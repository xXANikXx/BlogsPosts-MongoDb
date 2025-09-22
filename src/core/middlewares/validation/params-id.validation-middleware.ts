import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../typesAny/http-statuses";
import {ValidationErrorType} from "../../typesAny/validationError";
import {ValidationErrorDto} from "../../typesAny/validationError.dto";
import {FieldValidationError, validationResult, ValidationError} from "express-validator";


export const createErrorMessages = (errors: ValidationErrorType[]): ValidationErrorDto => {
    return { errorsMessages: errors };
};

const formatErrors = (error: ValidationError): ValidationErrorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        field: expressError.path,
        message: expressError.msg,
    };
};

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
        return;
    }

    next();
};
