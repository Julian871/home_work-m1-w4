import {
    getPostsQueryType,
    postTypeInput,
    postTypeOutput,
    postTypePostPut
} from "../db/types/post-types";
import {PostModel, CommentModel} from "../db/db";
import {ObjectId} from "mongodb";
import {postCommentInput, postCommentOutput} from "../db/types/comments-types";
import {getMyStatus} from "../utils/getLikeStatus.utility";


export const postsRepositories = {
    async getAllPosts(query: getPostsQueryType): Promise<postTypeOutput[]>{
        const posts = await PostModel.find({})

            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .sort({[query.sortBy]: query.sortDirection })
            .lean()

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

    async getAllPostsComments(query: getPostsQueryType, id: string): Promise<postCommentOutput[]>{
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
            likeInfo: {
                likesCount: p.likeInfo.countLike,
                dislikesCount: p.likeInfo.countDislike,
                myStatus: await getMyStatus(p._id.toString(), p.commentatorInfo.userId)
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

    async getPostById(id: string): Promise<postTypeOutput | null>{
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
            createdAt: post.createdAt
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
            createdAt: newPost.createdAt
        }
    },

    async createNewPostComment(newPostComment: postCommentInput): Promise<postCommentOutput> {
        await CommentModel.insertMany(newPostComment)
        return {
            id: newPostComment._id.toString(),
            content: newPostComment.content,
            commentatorInfo: newPostComment.commentatorInfo,
            createdAt: newPostComment.createdAt,
            likeInfo: {
                likesCount: newPostComment.likeInfo.countLike,
                dislikesCount: newPostComment.likeInfo.countDislike,
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
    }
}