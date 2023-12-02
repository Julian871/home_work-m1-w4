import {blogTypeInput, blogTypePostPut} from "../db/types/blog-types";
import {BlogsModel, PostModel} from "../db/db";
import {ObjectId} from "mongodb";
import {getBlogsQueryType} from "../db/types/blog-types";
import {getPostsQueryType, postTypeInput} from "../db/types/post-types";
import {injectable} from "inversify";


@injectable()
export class BlogsRepository {
    async getAllBlogs(query: getBlogsQueryType) {

        return BlogsModel.find({
            name: {$regex: query.searchNameTerm ? query.searchNameTerm : '', $options: 'i'}
        }).sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .lean()
    }

    async countBlogsByName(query: getBlogsQueryType): Promise<number> {
        return BlogsModel.countDocuments({
            name: {$regex: query.searchNameTerm ? query.searchNameTerm : '', $options: 'i'}
        });
    }

    async countBlogsByBlogId(blogId: string): Promise<number> {
        const _blogId = new ObjectId(blogId).toString()
        return PostModel.countDocuments({
            blogId: {$regex: _blogId ? _blogId : '', $options: 'i'}
        })
    }

    async getBlogById(id: string) {
        const _id = new ObjectId(id)
        return BlogsModel.findOne({_id: _id})
    }

    async getPostByBlogId(query: getPostsQueryType, blogId: string) {
        const _blogId = new ObjectId(blogId).toString()

        return PostModel.find({
            blogId: {$regex: _blogId ? _blogId : '', $options: 'i'}
        }).sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .lean()
    }

    async createNewBlog(newBlog: blogTypeInput) {
        await BlogsModel.insertMany(newBlog)
    }

    async createNewPostByBlogId(newPost: postTypeInput) {
        await PostModel.insertMany(newPost)
    }

    async updateBlogById(id: string, data: blogTypePostPut): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await BlogsModel.updateOne({_id: _id}, {
            $set: {
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            }
        })
        return result.matchedCount === 1
    }

    async deleteBlogById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await BlogsModel.deleteOne({_id: _id})
        return result.deletedCount === 1
    }
}