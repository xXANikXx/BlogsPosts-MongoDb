import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";
import { Post } from "../domain/post";
import { PostQueryInput } from "../routers/input/post-query.input";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { PostAttributes } from "../application/dtos/post-attributes";
import { SortDirection } from "../../core/typesAny/soft-diretction";


export const postsRepository = {
    async findMany(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[], totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = queryDto;

        const numericPageSize = Number(pageSize);
        const numericPageNumber = Number(pageNumber);

        const skip = (numericPageNumber - 1) * numericPageSize;
        const sortValue = sortDirection === 'asc' ? 1 : -1;

        const filter: any = {};

        const items = await postCollection
            .find(filter)
            .sort({ [sortBy]: sortValue })
            .skip(skip)
            .limit(numericPageSize)
            .toArray()

        const totalCount = await postCollection.countDocuments(filter)
        return { items, totalCount };

    },

    async findPostById(id: string): Promise<WithId<Post> | null> {
        return postCollection.findOne({ _id: new ObjectId(id) });
    },

    async findByIdOrFail(id: string): Promise<WithId<Post>> {
        const res = await postCollection.findOne({ _id: new ObjectId(id) });
        if (!res) {
            throw new RepositoryNotFoundError('Post not found');
        }
        return res;
    },

    async createPost(newPost: Post): Promise<string> {
        const insertResult = await postCollection.insertOne(newPost);

        return insertResult.insertedId.toString();
    },

    async updatePost(id: string, dto: PostAttributes): Promise<void> {
        const updateResult = await postCollection.updateOne({ _id: new ObjectId(id) },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                }
            }
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError("Post not found.");
        }
        return;
    },

    async deletePost(id: string): Promise<void> {
        const deleteResult = await postCollection.deleteOne(
            {
                _id: new ObjectId(id),
            });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("Post not found.");
        }
        return;
    },

    async findPostsByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{ items: WithId<Post>[], totalCount: number }> {


        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = queryDto;

        const numericPageSize = Number(pageSize);
        const skip = (Number(pageNumber) - 1) * numericPageSize;



        // Преобразование sortDirection в 1 или -1 для надежности в MongoDB
        const sortValue = sortDirection === 'asc' ? 1 : -1;

        const filter = { 'blogId': blogId };

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({ [sortBy]: sortValue })
                .skip(skip)
                .limit(numericPageSize)
                .toArray(),
            postCollection.countDocuments(filter),
        ]);

        return { items, totalCount };
    },

};