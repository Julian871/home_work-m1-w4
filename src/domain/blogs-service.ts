import {blogsRepositories} from "../repositories/blogs-db-reposetories";
import {blogTypeOutput, getBlogsQueryType} from "../db/types/blog-types";

export const blogsService = {

    async getAllBlogs(query: getBlogsQueryType): Promise<blogTypeOutput[]> {
        return blogsRepositories.getAllBlogs(query)
    },

    async getBlogById(id: string): Promise<blogTypeOutput | null> {
        return blogsRepositories.getBlogById(id)
    },
}