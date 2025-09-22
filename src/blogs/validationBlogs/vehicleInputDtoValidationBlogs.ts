import {BlogInputDto} from "../dtoBlogs/blog-input-dto";
import {ValidationError} from "../typesBlogs/validationError";

const websiteURL = /^https:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9_-]+)*\/?$/;

    export const vehicleInputDtoValidationBlogs = (data: BlogInputDto): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (
        !data.name ||
        typeof data.name.trim() !== 'string' ||
        data.name.trim().length < 1 ||
        data.name.trim().length > 15
    ) {
        errors.push({ field: 'name', message: 'Invalid name' });
    }

    if (
        !data.description ||
        typeof data.description.trim() !== 'string' ||
        data.description.trim().length < 1 ||
        data.description.trim().length > 500
    ) {
        errors.push({ field: 'description', message: 'Invalid description' });
    }

    if (
        !data.websiteUrl ||
        data.websiteUrl.trim().length < 5 ||
        data.websiteUrl.trim().length > 100 ||
        !websiteURL.test(data.websiteUrl)
    ) {
        errors.push({ field: 'websiteUrl', message: 'Invalid websiteUrl' });
    }

    return errors;
}