import {PostViewDto} from "../../dtoPosts/post-view-dto";
import {WithId} from "mongodb";
import {Post} from "../../typesPosts/post";


export function mapToPostViewModel(post: WithId<Post>): PostViewDto{
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    }
}