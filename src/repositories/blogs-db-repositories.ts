import {blogTypeInput, blogTypeOutput, blogTypePostPut} from "../db/types/blog-types";
import {BlogsModel, postsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {getBlogsQueryType} from "../db/types/blog-types";
import {getPostsQueryType, postTypeInput} from "../db/types/post-types";

export const blogsRepositories = {
    async getAllBlogs(query: getBlogsQueryType): Promise<blogTypeOutput[]>{

        const blogs = await BlogsModel.find({
        name: {$regex: query.searchNameTerm ? query.searchNameTerm : '', $options: 'i'}
        }).sort({[query.sortBy]: query.sortDirection })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .lean()

        return blogs.map((p) => ({
                    id: p._id.toString(),
                    name: p.name,
                    description: p.description,
                    websiteUrl: p.websiteUrl,
                    createdAt: p.createdAt,
                    isMembership: p.isMembership
        }))
    },

    async countBlogsByName(query: getBlogsQueryType): Promise<number>{
        return BlogsModel.countDocuments({
            name: {$regex: query.searchNameTerm ? query.searchNameTerm : '', $options: 'i'}
        });
    },

    async countBlogsByBlogId(blogId: string): Promise<number>{
        const _blogId = new ObjectId(blogId).toString()
        return await postsCollection.countDocuments({
            blogId: {$regex: _blogId ? _blogId : '', $options: 'i'}
        })
    },



    async getBlogById(id: string): Promise<blogTypeOutput | null> {
        const _id = new ObjectId(id)
        const blog: blogTypeInput | null = await BlogsModel.findOne({_id: _id})
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },

    async getPostByBlogId(query: getPostsQueryType, blogId: string) {
        const _blogId = new ObjectId(blogId).toString()

        const posts = await postsCollection.find({
            blogId: {$regex: _blogId ? _blogId : '', $options: 'i'}
        }).sort({[query.sortBy]: query.sortDirection })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return posts.map((p) => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt
        }))
    },



    async createNewBlog(newBlog: blogTypeInput): Promise<blogTypeOutput> {

        await BlogsModel.insertMany(newBlog)
        return {
            id: newBlog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },

    async createNewPostByBlogId(blogId: string, newPost: postTypeInput) {
        const _blogId = new ObjectId(blogId)
        const checkBlogId = await BlogsModel.findOne({_id: _blogId})

        if (!checkBlogId) {
            return false
        }

        await postsCollection.insertOne(newPost)
        return  {
            id: newPost._id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        }

    },

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
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await BlogsModel.deleteOne({_id: _id})
        return result.deletedCount === 1
    }
}