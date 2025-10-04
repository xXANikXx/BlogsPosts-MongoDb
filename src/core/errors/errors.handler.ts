import {Response} from 'express';
import {RepositoryNotFoundError} from "./repository-not-found.error";
import {
    createErrorMessages
} from "../middlewares/validation/input_validation-result.middleware";
import {HttpStatus} from "../typesAny/http-statuses";
import {DomainError} from "./domain.error";


export function errorHandler(error: unknown, res: Response): void {
    if (error instanceof RepositoryNotFoundError) {
        const httpStatus = HttpStatus.NotFound;

        res.status(httpStatus).send(
            createErrorMessages([
                {
                status: httpStatus,
                detail: error.message,
            },
            ]),
        );

        return;
    }

    if (error instanceof DomainError) {
        const httpStatus = HttpStatus.UnprocessableEntity;

        res.status(httpStatus).send(
            createErrorMessages([
                {
                    status: httpStatus,
                    source: error.source,
                    detail: error.message,
                    code: error.code,
                },
            ]),
        );

        return;
    }

    res.status(HttpStatus.InternalServerError);
    return;
}