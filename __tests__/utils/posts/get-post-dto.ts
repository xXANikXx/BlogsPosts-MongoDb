import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';

export function getPostDto(blogId: string): PostAttributes {
    return {
        title: 'Amazing song',
        shortDescription: 'OMG, ASPA, ETA',
        content: 'Cool with you',
        blogId,
    };
}