import {getPostsQueryType, postTypeInput, postTypeOutput, postTypePostPut} from "../db/types/post-types";
import {postsCollection} from "../db/db";
import {ObjectId} from "mongodb";


export const postsReposetories = {
    async getAllPosts(query: getPostsQueryType): Promise<postTypeOutput[]>{
        const posts = await postsCollection.find({})

            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .sort({[query.sortBy]: query.sortDirection })
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

    async getPostById(id: string): Promise<postTypeOutput | null>{
        const _id = new ObjectId(id)
        const post: postTypeInput | null = await postsCollection.findOne({_id: _id})
        if(!post) {
            return null
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt


        }
    },
    async createNewPost(data: postTypePostPut): Promise<postTypeOutput> {
        const newPost: postTypeInput = {
            _id: new ObjectId(),
            ...data,
            blogName: "string",
            createdAt: new Date().toISOString()
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

    async updatePostById(id: string, data: postTypePostPut): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await postsCollection.updateOne({_id: _id}, {
            $set: {
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId
            }})
        return result.matchedCount === 1
    },

    async deletePostById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await postsCollection.deleteOne({_id: _id})
        return result.deletedCount === 1
    }
}