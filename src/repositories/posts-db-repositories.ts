import {
    getPostsQueryType,
    postTypeInput,
    postTypeOutput,
    postTypePostPut
} from "../db/types/post-types";
import {PostModel, CommentModel} from "../db/db";
import {ObjectId} from "mongodb";
import {postCommentInput, postCommentOutput} from "../db/types/comments-types";
import {getLikeListToPost, getMyStatus, getMyStatusToPost} from "../utils/getLikeStatus.utility";


export const postsRepositories = {
    async getAllPosts(query: getPostsQueryType, userId: string): Promise<postTypeOutput[]>{
        const posts = await PostModel.find({})

            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .sort({[query.sortBy]: query.sortDirection })
            .lean()

        return Promise.all(posts.map(async (p) => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt,
            extendedLikesInfo: {
                likesCount: p.extendedLikesInfo.countLike,
                dislikesCount: p.extendedLikesInfo.countDislike,
                myStatus: await getMyStatusToPost(p._id.toString(), userId),
                newestLikes: await getLikeListToPost(p._id.toString())
            }

        })))
    },

    async getAllPostsComments(query: getPostsQueryType, id: string, userId: string): Promise<postCommentOutput[]>{
        const posts = await CommentModel.find({
            idPost: {$regex: id ? id : '', $options: 'i'}
        })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .sort({[query.sortBy]: query.sortDirection })
            .lean()

        return Promise.all(posts.map(async (p) => ({
            id: p._id.toString(),
            content: p.content,
            commentatorInfo: p.commentatorInfo,
            createdAt: p.createdAt,
            likesInfo: {
                likesCount: p.likesInfo.countLike,
                dislikesCount: p.likesInfo.countDislike,
                myStatus: await getMyStatus(p._id.toString(), userId)
            }
        })))
    },

    async countPosts(): Promise<number>{
        return PostModel.countDocuments();
    },

    async countPostsComments(id: string): Promise<number>{
        return CommentModel.countDocuments({
            idPost: {$regex: id ? id : '', $options: 'i'}
        })
    },

    async getPostById(id: string, userId: string): Promise<postTypeOutput | null>{
        const _id = new ObjectId(id)
        const post: postTypeInput | null = await PostModel.findOne({_id: _id})
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
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.countLike,
                dislikesCount: post.extendedLikesInfo.countDislike,
                myStatus: await getMyStatusToPost(post._id.toString(), userId),
                newestLikes: await getLikeListToPost(post._id.toString())
            }
        }
    },

    async createNewPost(newPost: postTypeInput): Promise<postTypeOutput> {
        await PostModel.insertMany(newPost)
        return  {
            id: newPost._id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
            extendedLikesInfo: {
                likesCount: newPost.extendedLikesInfo.countLike,
                dislikesCount: newPost.extendedLikesInfo.countDislike,
                myStatus: 'None',
                newestLikes: []
            }
        }
    },

    async createNewPostComment(newPostComment: postCommentInput): Promise<postCommentOutput> {
        await CommentModel.insertMany(newPostComment)
        return {
            id: newPostComment._id.toString(),
            content: newPostComment.content,
            commentatorInfo: newPostComment.commentatorInfo,
            createdAt: newPostComment.createdAt,
            likesInfo: {
                likesCount: newPostComment.likesInfo.countLike,
                dislikesCount: newPostComment.likesInfo.countDislike,
                myStatus: 'None'
            }
        }
    },

    async updatePostById(id: string, data: postTypePostPut): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await PostModel.updateOne({_id: _id}, {
            $set: {
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId
            }})
        return result.matchedCount === 1
    },

    async checkPostCollection(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await PostModel.findOne({_id: _id})
        return !!result;
    },

    async checkPostCommentCollection(id: string): Promise<boolean> {
        const result = await CommentModel.findOne({idPost: id})
        return !!result;
    },

    async deletePostById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await PostModel.deleteOne({_id: _id})
        return result.deletedCount === 1
    },

    async getLikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        return PostModel.findOne({_id: _id, 'extendedLikesInfo.likeList.userId': userId})
    },

    async getDislikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        return PostModel.findOne({_id: _id, 'extendedLikesInfo.dislikeList': userId})
    },

    async updateLikeStatus(id: string, newLike: any) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {$inc: {'extendedLikesInfo.countLike': 1}, $push: {'extendedLikesInfo.likeList': newLike}}
        )
    },

    async updateDislikeStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {$inc: {'extendedLikesInfo.countDislike': 1}, $push: {'extendedLikesInfo.dislikeList': userId}}
        )
    },

    async updateLikeToNoneStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {$pull: {'extendedLikesInfo.likeList': userId}, $inc: {'extendedLikesInfo.countLike': -1}}
        )
    },

    async updateDislikeToNoneStatus(id: string, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {$pull: {'extendedLikesInfo.dislikeList': userId}, $inc: {'extendedLikesInfo.countDislike': -1}}
        )
    },

    async updateLikeToDislike(id: string, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {
                $pull: {'extendedLikesInfo.likeList': {userId: userId}},
                $inc: {'extendedLikesInfo.countLike': -1, 'extendedLikesInfo.countDislike': 1},
                $push: {'extendedLikesInfo.dislikeList': userId}
            })
    },

    async updateDislikeToLike(id: string, newLike: any, userId: string) {
        const _id = new ObjectId(id)
        await PostModel.updateOne(
            {_id: _id},
            {
                $pull: {'extendedLikesInfo.dislikeList': userId},
                $inc: {'extendedLikesInfo.countDislike': -1, 'extendedLikesInfo.countLike': 1},
                $push: {'extendedLikesInfo.likeList': newLike}
            })
    },

    async getLikeListToPost(id: string) {
        const _id = new ObjectId(id)
        return PostModel.findOne({_id: _id}, {'extendedLikesInfo.likeList': {$slice: -3}})
    }
}