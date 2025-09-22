import { Blog } from "../blogs/typesBlogs/blog";
import { Post } from "../posts/typesPosts/post";

export const dbBlogs = {
    blogs: <Blog[]>[
        {
            id: 'string',
            name: 'string',
            description: 'string',
            websiteUrl: 'string'
        }
    ]
};


export const dbPosts = {
    posts: <Post[]>[{
        id: 'string',
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
        blogName: 'string'
    }]
}