import {blogsRepositories} from "../repositories/blogs-db-reposetories";
import {blogTypeInput, blogTypeOutput, blogTypePostPut, getBlogsQueryType} from "../db/types/blog-types";
import {getPostsQueryType, postTypeInput, postTypePostPut} from "../db/types/post-types";
import {ObjectId} from "mongodb";
import {headTypes} from "../db/types/head-types";
import {postsReposetories} from "../repositories/posts-db-reposetories";

export const blogsService = {

    async getAllBlogs(query: getBlogsQueryType): Promise<headTypes> {
        const blogsCount = await blogsRepositories.countBlogsByName(query)
        const filterBlogs = await blogsRepositories.getAllBlogs(query)
        return {

            pagesCount: Math.ceil(blogsCount / query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: blogsCount,
            items: filterBlogs
        }
    },

    async getBlogById(id: string): Promise<blogTypeOutput | null> {
        return blogsRepositories.getBlogById(id)
    },

    async getPostByBlogId(query: getPostsQueryType, blogId: string) {
        const filterPostsByBlogId = await blogsRepositories.getPostByBlogId(query, blogId)
        const countPost = await postsReposetories.countPosts()

        return {

            pagesCount: Math.ceil(countPost / query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: countPost,
            items: filterPostsByBlogId
        }
    },

    async createNewBlog(data: blogTypePostPut): Promise<blogTypeOutput> {
        const newBlog: blogTypeInput = {
            _id: new ObjectId(),
            ...data,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return blogsRepositories.createNewBlog(newBlog)
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

    async updateBlogById(id: string, data: blogTypePostPut): Promise<boolean> {
        return await blogsRepositories.updateBlogById(id, data)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepositories.deleteBlogById(id)
    }
}