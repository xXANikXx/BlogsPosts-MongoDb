import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../typesAny/http-statuses";
import {ValidationErrorType} from "../../typesAny/validationError";
import {ValidationErrorListOutput} from "../../typesAny/validationError.dto";
import {
    FieldValidationError,
    ValidationError,
    validationResult
} from "express-validator";


export const createErrorMessages =
    (errors: ValidationErrorType[],
     ): ValidationErrorListOutput => {
    return {
        errors: errors.map((error) => ({
            status: error.status,
            detail: error.detail,
            source: {pointer: error.source ?? '' },
            code: error.code ?? null,
        })),
    };
};

const formatValidationErrors =
    (error: ValidationError): ValidationErrorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        status: HttpStatus.BadRequest,
        source: expressError.path,
        detail: expressError.msg,
    };
};

export const inputValidationResultMiddleware = (
    req: Request <{}, {}, {}, {}>,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req)
        .formatWith(formatValidationErrors).
        array({ onlyFirstError: true });

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).json({ createErrorsMessages: errors });
        return;
    }

    next();
};
