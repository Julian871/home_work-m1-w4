import {getPostsQueryType, postTypeInput, postTypeOutput, postTypePostPut} from "../db/types/post-types";
import {postsReposetories} from "../repositories/posts-db-reposetories";
import {ObjectId} from "mongodb";


export const postsService = {
    async getAllPosts(query: getPostsQueryType): Promise<postTypeOutput[]>{
        return postsReposetories.getAllPosts(query)
    },

    async getPostById(id: string): Promise<postTypeOutput | null>{
        return postsReposetories.getPostById(id)
    },

    async createNewPost(data: postTypePostPut): Promise<postTypeOutput> {
        const newPost: postTypeInput = {
            _id: new ObjectId(),
            ...data,
            blogName: (Math.random() * 100).toString(),
            createdAt: new Date().toISOString()
        }

        return postsReposetories.createNewPost(newPost)
    },

    async updatePostById(id: string, data: postTypePostPut): Promise<boolean> {
        return postsReposetories.updatePostById(id, data)
    },

    async deletePostById(id: string): Promise<boolean> {
        return postsReposetories.deletePostById(id)
    }

}