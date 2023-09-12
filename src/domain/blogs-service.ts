import {blogsRepositories} from "../repositories/blogs-db-reposetories";
import {blogTypeOutput} from "../db/types/blog-types";

export const blogsService = {


    async getBlogById(id: string): Promise<blogTypeOutput | null> {
        return blogsRepositories.getBlogById(id)
        }
}