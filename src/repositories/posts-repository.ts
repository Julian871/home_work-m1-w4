import {
    getPostsQueryType,
    postTypeInput,
    postTypePostPut
} from "../db/types/post-types";
import {PostModel, CommentModel} from "../db/db";
import {ObjectId} from "mongodb";
import {postCommentInput} from "../db/types/comments-types";


export class PostsRepository {
    async getAllPosts(query: getPostsQueryType) {
        return PostModel.find({})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .sort({[query.sortBy]: query.sortDirection})
            .lean()
    }

    async getAllPostsComments(query: getPostsQueryType, id: string) {
        return CommentModel.find({
            idPost: {$regex: id ? id : '', $options: 'i'}
        })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .sort({[query.sortBy]: query.sortDirection})
            .lean()
    }

    async countPosts(): Promise<number> {
        return PostModel.countDocuments();
    }

    async countPostsComments(id: string): Promise<number> {
        return CommentModel.countDocuments({
            idPost: {$regex: id ? id : '', $options: 'i'}
        })
    }

    async getPostById(id: string) {
        const _id = new ObjectId(id)
        return PostModel.findOne({_id: _id})
    }

    async createNewPost(newPost: postTypeInput) {
        await PostModel.insertMany(newPost)
    }

    async createNewPostComment(newPostComment: postCommentInput) {
        await CommentModel.insertMany(newPostComment)
    }

    async updatePostById(id: string, data: postTypePostPut): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await PostModel.updateOne({_id: _id}, {
            $set: {
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId
            }
        })
        return result.matchedCount === 1
    }

    async checkPostCollection(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await PostModel.findOne({_id: _id})
        return !!result;
    }

    async checkPostCommentCollection(id: string): Promise<boolean> {
        const result = await CommentModel.findOne({idPost: id})
        return !!result;
    }

    async deletePostById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await PostModel.deleteOne({_id: _id})
        return result.deletedCount === 1
    }

    async getLikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        return PostModel.findOne({_id: _id, 'extendedLikesInfo.likeList.userId': userId})
    }

    async getDislikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        return PostModel.findOne({_id: _id, 'extendedLikesInfo.dislikeList': userId})
    }

    async updateLikeStatus(id: string, newLike: any) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {$inc: {'extendedLikesInfo.countLike': 1}, $push: {'extendedLikesInfo.likeList': newLike}}
        )
    }

    async updateDislikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {$inc: {'extendedLikesInfo.countDislike': 1}, $push: {'extendedLikesInfo.dislikeList': userId}}
        )
    }

    async updateLikeToNoneStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {$pull: {'extendedLikesInfo.likeList': {userId: userId}}, $inc: {'extendedLikesInfo.countLike': -1}}
        )
    }

    async updateDislikeToNoneStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {$pull: {'extendedLikesInfo.dislikeList': userId}, $inc: {'extendedLikesInfo.countDislike': -1}}
        )
    }

    async updateLikeToDislike(id: string, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {
                $pull: {'extendedLikesInfo.likeList': {userId: userId}},
                $inc: {'extendedLikesInfo.countLike': -1, 'extendedLikesInfo.countDislike': 1},
                $push: {'extendedLikesInfo.dislikeList': userId}
            })
    }

    async updateDislikeToLike(id: string, newLike: any, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {
                $pull: {'extendedLikesInfo.dislikeList': userId},
                $inc: {'extendedLikesInfo.countDislike': -1, 'extendedLikesInfo.countLike': 1},
                $push: {'extendedLikesInfo.likeList': newLike}
            })
    }

    async getLikeListToPost(id: string) {
        const _id = new ObjectId(id)
        return PostModel.findOne({_id: _id}, {'extendedLikesInfo.likeList': {$slice: -3}})
    }
}