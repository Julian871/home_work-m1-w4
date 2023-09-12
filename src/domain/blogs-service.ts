import {blogsRepositories} from "../repositories/blogs-db-reposetories";
import {blogTypeOutput, getBlogsQueryType} from "../db/types/blog-types";
import {getPostsQueryType} from "../db/types/post-types";

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
}