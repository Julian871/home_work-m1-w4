import {blogsRepositories} from "../repositories/blogs-db-reposetories";
import {blogTypeInput, blogTypeOutput, blogTypePostPut, getBlogsQueryType} from "../db/types/blog-types";
import {getPostsQueryType, postTypeInput, postTypePostPut} from "../db/types/post-types";
import {ObjectId} from "mongodb";

export const blogsService = {

    async getAllBlogs(query: getBlogsQueryType): Promise<blogTypeOutput[]> {
        return blogsRepositories.getAllBlogs(query)
    },

    async getBlogById(id: string): Promise<blogTypeOutput | null> {
        return blogsRepositories.getBlogById(id)
    },

    async getPostByBlogId(query: getPostsQueryType, blogId: string) {
        return blogsRepositories.getPostByBlogId(query, blogId)
    },

    async createNewBlog(data: blogTypePostPut): Promise<blogTypeOutput> {
        const newBlog: blogTypeInput = {
            _id: new ObjectId(),
            ...data,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepositories.createNewBlog(newBlog)
    },

    async createNewPostByBlogId(blogId: string, data: postTypePostPut) {


        const newPost: postTypeInput = {
            _id: new ObjectId(),
            ...data,
            blogId,
            blogName: (Math.random()*100).toString(),
            createdAt: new Date().toISOString()
        }
        return await blogsRepositories.createNewPostByBlogId(blogId, newPost)

    },
}