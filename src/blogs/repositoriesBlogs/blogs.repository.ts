import { ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../db/mongo.db";
import { Blog } from "../domain/blog";
import { BlogQueryInput } from "../routers/input/blog-query.input";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { BlogAttributes } from "../application/dtos/blog-attributes";

export const blogsRepository = {
    async findMany(
        queryDto: BlogQueryInput,
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            searchNameTerm,
        } = queryDto;

        const finalPageNumber = parseInt(pageNumber as any, 10);
        const finalPageSize = parseInt(pageSize as any, 10);

        const sortValue = sortDirection === 'asc' ? 1 : -1;

        const skip = (finalPageNumber - 1) * finalPageSize;
        const filter: any = {};

        if (searchNameTerm && searchNameTerm.trim() !== '') {
            // Устанавливаем фильтр $regex с опцией 'i' для нечувствительности к регистру
            filter.name = { $regex: searchNameTerm, $options: "i" };
            console.log('DEBUG: Filter applied:', JSON.stringify(filter));
        }


        const items = await blogCollection
            .find(filter)
            .sort({ [sortBy]: sortValue })
            .skip(skip)
            .limit(finalPageSize)
            .toArray();

        const totalCount = await blogCollection.countDocuments(filter);
        console.log('Final Filter:', JSON.stringify(filter));
        return { items, totalCount };

    },


    async findBlogById(id: string): Promise<WithId<Blog> | null> {
        return blogCollection.findOne({ _id: new ObjectId(id) });
    },

    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        const res = await blogCollection.findOne({ _id: new ObjectId(id) });
        if (!res) {
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return res;
    },

    async createBlog(newBlog: Blog): Promise<string> {
        const insertResult = await blogCollection.insertOne(newBlog);
        return insertResult.insertedId.toString();
    },

    async updateBlog(id: string, dto: BlogAttributes): Promise<void> {
        const updateResult = await blogCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name: dto.name,
                    description: dto.description,
                    websiteUrl: dto.websiteUrl,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError("No blog found.");
        }
        return;
    },

    async deleteBlog(id: string): Promise<void> {
        const deleteResult = await blogCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("Blog not found.");
        }
        return;
    },
};