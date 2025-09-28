import {Blog} from "../../typesBlogs/blog";
import { WithId } from 'mongodb';
import {BlogViewDto} from "../../dtoBlogs/blog-view-dto";

export function mapToBlogViewModel(blog: WithId<Blog>): BlogViewDto {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    };
};