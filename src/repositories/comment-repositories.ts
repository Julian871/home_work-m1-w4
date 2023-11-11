import {ObjectId} from "mongodb";
import {postsCommentsCollection} from "../db/db";
import {postCommentInput, postCommentOutput, postCommentPut} from "../db/types/comments-types";


export const commentsRepositories = {
    async updateCommentById(id: string, data: postCommentPut): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await postsCommentsCollection.updateOne({_id: _id}, {
            $set: {
                content: data.content
            }})
        return result.matchedCount === 1
    },

    async getCommentById(id: string): Promise<postCommentOutput | null>{
        const _id = new ObjectId(id)
        const comment: postCommentInput | null = await postsCommentsCollection.findOne({_id: _id})
        if(!comment) {
            return null
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt
        }
    },

    async deleteCommentById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await postsCommentsCollection.deleteOne({_id: _id})
        return result.deletedCount === 1
    },

    async updateLikeStatus(id: string, likeStatus: string) {
        const _id = new ObjectId(id)
        await postsCommentsCollection.updateOne({_id: _id}, {$set: {likeStatus: likeStatus}})
    }
}