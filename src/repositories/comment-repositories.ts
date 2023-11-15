import {ObjectId} from "mongodb";
import {CommentModel} from "../db/db";
import {postCommentPut} from "../db/types/comments-types";


export const commentsRepositories = {
    async updateCommentById(id: string, data: postCommentPut): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await CommentModel.updateOne({_id: _id}, {
            $set: {
                content: data.content
            }})
        return result.matchedCount === 1
    },

    async getCommentById(id: string) {
        const _id = new ObjectId(id)
        return CommentModel.findOne({_id: _id})
    },

    async deleteCommentById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await CommentModel.deleteOne({_id: _id})
        return result.deletedCount === 1
    },

    async getLikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        return CommentModel.findOne({_id: _id, 'likeInfo.likeList': userId})
    },

    async getDislikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        return CommentModel.findOne({_id: _id, 'likeInfo.dislikeList': userId})
    },

    async updateLikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {$inc: {'likeInfo.countLike': 1}, $push: {'likeInfo.likeList': userId}}
        )
    },

    async updateDislikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {$inc: {'likeInfo.countDislike': 1}, $push: {'likeInfo.dislikeList': userId}}
        )
    },

    async updateLikeToNoneStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {$pull: {'likeInfo.likeList': userId}, $inc: {'likeInfo.countLike': -1}}
        )
    },

    async updateDislikeToNoneStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {$pull: {'likeInfo.dislikeList': userId}, $inc: {'likeInfo.countDislike': -1}}
        )
    },

    async updateLikeToDislike(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {
                $pull: {'likeInfo.likeList': userId},
                $inc: {'likeInfo.countLike': -1, 'likeInfo.countDislike': 1},
                $push: {'likeInfo.dislikeList': userId}
            })
    },

    async updateDislikeToLike(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {
                $pull: {'likeInfo.dislikeList': userId},
                $inc: {'likeInfo.countDislike': -1, 'likeInfo.countLike': 1},
                $push: {'likeInfo.likeList': userId}
            })
    },
}