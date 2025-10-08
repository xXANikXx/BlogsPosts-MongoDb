import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { BlogListPaginatedOutput } from "../output/blog-list-paginated.output";


export function mapToBlogListPaginatedOutput(
    blogs: WithId<Blog>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): BlogListPaginatedOutput {

    const pagesCount =
        (meta.pageSize > 0)
            ? Math.ceil(meta.totalCount / meta.pageSize)
            : 0; // Если pageSize <= 0, страниц нет.

    return {
        pagesCount: pagesCount,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: blogs.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        })),
    };
}
