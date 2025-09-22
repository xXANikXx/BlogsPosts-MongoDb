import {PostInputDTO} from "../dtoPosts/post-input-dto";
import {ValidationError} from "../typesPosts/validationError";

export const vehicleInputDtoValidationPosts = (data: PostInputDTO): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (
        !data.title ||
        typeof data.title.trim() !== 'string' ||
        data.title.trim().length < 1 ||
        data.title.trim().length > 30
    ) {
        errors.push({ field: 'title', message: 'Invalid title' });
    }

    if (
        !data.shortDescription ||
        typeof data.shortDescription.trim() !== 'string' ||
        data.shortDescription.trim().length < 1 ||
        data.shortDescription.trim().length > 100
    ) {
        errors.push({ field: 'shortDescription', message: 'Invalid shortDescription' });
    }

    if (
        !data.content ||
        typeof data.content.trim() !== 'string' ||
        data.content.trim().length < 1 ||
        data.content.trim().length > 1000
    ) {
        errors.push({ field: 'content', message: 'Invalid content' });
    }

    if (
        !data.blogId ||
        typeof data.blogId !== 'string' ||
        data.blogId.trim().length === 0
    ) {
        errors.push({ field: 'blogId', message: 'Invalid blogId' });
    }

    return errors;
}