import {getPostsQueryType, postTypeInput, postTypeOutput, postTypePostPut} from "../db/types/post-types";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {ObjectId} from "mongodb";
import {headTypes} from "../db/types/head-types";


export const postsService = {
    async getAllPosts(query: getPostsQueryType): Promise<headTypes>{
        const countPosts = await postsRepositories.countPosts()
        const filterPosts = await postsRepositories.getAllPosts(query)

        return {

            pagesCount: Math.ceil(countPosts / query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: countPosts,
            items: filterPosts
        }
    },

    async getPostById(id: string): Promise<postTypeOutput | null>{
        return postsRepositories.getPostById(id)
    },

    async createNewPost(data: postTypePostPut): Promise<postTypeOutput> {
        const newPost: postTypeInput = {
            _id: new ObjectId(),
            ...data,
            blogName: (Math.random() * 100).toString(),
            createdAt: new Date().toISOString()
        }

        return postsRepositories.createNewPost(newPost)
    },

    async updatePostById(id: string, data: postTypePostPut): Promise<boolean> {
        return postsRepositories.updatePostById(id, data)
    },

    async deletePostById(id: string): Promise<boolean> {
        return postsRepositories.deletePostById(id)
    }

}