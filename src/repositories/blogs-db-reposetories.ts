import {blogTypeInput, blogTypeOutput, blogTypePostPut} from "../db/types/blog-types";
import {blogsCollection, postsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {postTypeInput, postTypeOutput} from "../db/types/post-types";

export const blogsRepositories = {
    async getAllBlogs(blogs: blogTypeInput[]): Promise<blogTypeOutput[]>{

        return blogs.map((p) => ({
                    id: p._id.toString(),
                    name: p.name,
                    description: p.description,
                    websiteUrl: p.websiteUrl,
                    createdAt: p.createdAt,
                    isMembership: p.isMembership
        }))
    },



    async getBlogById(id: string): Promise<blogTypeInput | null> {
        const _id = new ObjectId(id)
        return await blogsCollection.findOne({_id: _id})

     },

    async getPostByBlogId(posts: postTypeInput[]): Promise<postTypeOutput[]> {


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

    async createNewBlog(newBlog: blogTypeInput): Promise<blogTypeInput> {

        await blogsCollection.insertOne(newBlog)
        return newBlog
    },

    async createNewPostByBlogId(newPost: postTypeInput) {

            await postsCollection.insertOne(newPost)
            return newPost
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