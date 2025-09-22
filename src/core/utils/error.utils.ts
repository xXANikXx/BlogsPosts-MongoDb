import { ValidationError } from '../../posts/typesPosts/validationError';

export const createErrorMessages = (
    errors: ValidationError[],
): { errorsMessages: ValidationError[] } => {
    return { errorsMessages: errors };
};
