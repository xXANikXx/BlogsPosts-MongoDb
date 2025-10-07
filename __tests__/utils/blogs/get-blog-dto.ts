import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';

export function getBlogDto(): BlogAttributes {
    return {
        name: 'Haerin NewJeans',
        description: 'NewSongFromNJ',
        websiteUrl: 'https://youtube.com/watch',
    }
}