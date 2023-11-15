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
        return CommentModel.findOne({_id: _id, 'likesInfo.likeList': userId})
    },

    async getDislikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        return CommentModel.findOne({_id: _id, 'likesInfo.dislikeList': userId})
    },

    async updateLikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {$inc: {'likesInfo.countLike': 1}, $push: {'likesInfo.likeList': userId}}
        )
    },

    async updateDislikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {$inc: {'likesInfo.countDislike': 1}, $push: {'likesInfo.dislikeList': userId}}
        )
    },

    async updateLikeToNoneStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {$pull: {'likesInfo.likeList': userId}, $inc: {'likesInfo.countLike': -1}}
        )
    },

    async updateDislikeToNoneStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {$pull: {'likesInfo.dislikeList': userId}, $inc: {'likesInfo.countDislike': -1}}
        )
    },

    async updateLikeToDislike(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {
                $pull: {'likesInfo.likeList': userId},
                $inc: {'likesInfo.countLike': -1, 'likesInfo.countDislike': 1},
                $push: {'likesInfo.dislikeList': userId}
            })
    },

    async updateDislikeToLike(id: string, userId: string) {
        const _id = new ObjectId(id)
        await CommentModel.updateOne(
            {_id: _id},
            {
                $pull: {'likesInfo.dislikeList': userId},
                $inc: {'likesInfo.countDislike': -1, 'likesInfo.countLike': 1},
                $push: {'likesInfo.likeList': userId}
            })
    },
}