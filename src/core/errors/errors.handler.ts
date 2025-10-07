import { Response } from 'express';
import { RepositoryNotFoundError } from "./repository-not-found.error";
import {
    createErrorMessages
} from "../middlewares/validation/input_validation-result.middleware";
import { HttpStatus } from "../typesAny/http-statuses";
import { DomainError } from "./domain.error";


export function errorHandler(error: unknown, res: Response): void {
    if (error instanceof RepositoryNotFoundError) {
        res.status(HttpStatus.NotFound).send({
            errors: [
                {
                    message: error.message,
                    field: 'id',
                },
            ],
        });
        return;
    }

    if (error instanceof DomainError) {
        res.status(HttpStatus.UnprocessableEntity).send({
            errors: [
                {
                    message: error.message,
                    field: error.field,
                },
            ],
        });
        return;
    }


    if (error instanceof Error) {
        console.error('Error Stack:', error.stack);
    }

    // Ошибка 500 Internal Server Error
    res.status(HttpStatus.InternalServerError).send({
        errors: [
            {
                message: 'Internal server error',
            },
        ],
    });
}