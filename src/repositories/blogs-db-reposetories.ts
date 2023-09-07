import {blogTypeGet, blogTypeInput, blogTypeOutput, blogTypePostPut} from "../db/types/blog-types";
import {blogsCollection} from "../db/db";
import {ObjectId} from "mongodb";

export const blogsReposetories = {
    async getAllBlogs(): Promise<blogTypeOutput[]>{
        const blogs = await blogsCollection.find({}).toArray()

        return blogs.map((p) => ({
                    id: p._id.toString(),
                    name: p.name,
                    description: p.description,
                    websiteUrl: p.websiteUrl,
                    createdAt: p.createdAt,
                    isMembership: p.isMembership
        }))
    },



    async getBlogById(id: string): Promise<blogTypeOutput | null> {
        const _id = new ObjectId(id)
        const blog: blogTypeInput | null = await blogsCollection.findOne({_id: _id})
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

    async createNewBlog(data: blogTypePostPut): Promise<blogTypeOutput> {
        const newBlog: blogTypeInput = {
            _id: new ObjectId(),
            ...data,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog)
        return {
            id: newBlog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },

    async updateBlogById(id: string, data: blogTypePostPut): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await blogsCollection.updateOne({_id: _id}, {
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
        const result = await blogsCollection.deleteOne({_id: _id})
        return result.deletedCount === 1
    }
}