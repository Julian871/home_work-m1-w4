import {
    getPostsQueryType,
    postTypeInput,
    postTypeOutput,
    postTypePostPut
} from "../db/types/post-types";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {ObjectId} from "mongodb";
import {headTypes} from "../db/types/head-types";
import {postCommentInput, postCommentOutput, postCommentPut} from "../db/types/comments-types";
import {userTypeOutput} from "../db/types/user-types";


export const postsService = {
    async getAllPosts(query: getPostsQueryType, userId: string): Promise<headTypes>{
        const countPosts = await postsRepositories.countPosts()
        const filterPosts = await postsRepositories.getAllPosts(query, userId)

        return {

            pagesCount: Math.ceil(countPosts / query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: countPosts,
            items: filterPosts
        }
    },

    async getAllPostsComments(query: getPostsQueryType, id: string, userId: string): Promise<headTypes>{
        const countPostsComments = await postsRepositories.countPostsComments(id)
        const filterPostsComments = await postsRepositories.getAllPostsComments(query, id, userId)

        return {
            pagesCount: Math.ceil(countPostsComments / query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: countPostsComments,
            items: filterPostsComments
        }
    },

    async getPostById(id: string, userId: string): Promise<postTypeOutput | null>{
        return postsRepositories.getPostById(id, userId)
    },

    async createNewPost(data: postTypePostPut): Promise<postTypeOutput> {
        const newPost: postTypeInput = {
            _id: new ObjectId(),
            ...data,
            blogName: (Math.random() * 100).toString(),
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                countLike: 0,
                countDislike: 0,
                likeList:[],
                dislikeList:[]
            }
        }

        return postsRepositories.createNewPost(newPost)
    },

    async createNewPostComment(idPost: string, data: postCommentPut, user: userTypeOutput ): Promise<postCommentOutput> {

        const newPostComment: postCommentInput = {
            _id: new ObjectId(),
            ...data,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            idPost,
            likesInfo: {
                countLike: 0,
                countDislike: 0,
                likeList: [],
                dislikeList: []
            }
        }

        return postsRepositories.createNewPostComment(newPostComment)
    },

    async checkPostCollection(id: string): Promise<boolean> {
        return postsRepositories.checkPostCollection(id)
    },

    async checkPostCommentCollection(id: string): Promise<boolean> {
        return postsRepositories.checkPostCommentCollection(id)
    },

    async updatePostById(id: string, data: postTypePostPut): Promise<boolean> {
        return postsRepositories.updatePostById(id, data)
    },

    async deletePostById(id: string): Promise<boolean> {
        return postsRepositories.deletePostById(id)
    },

    async updateLikeStatus(id: string, likeStatus: string, userId: string, login: string) {
        const newLike = {
            addedAt: new Date(),
            userId: userId,
            login: login
        }
        const checkOnLike = await postsRepositories.getLikeStatus(id, userId)
        if(checkOnLike && likeStatus === 'None') {
            return await postsRepositories.updateLikeToNoneStatus(id, userId)
        } else if(checkOnLike && likeStatus === 'Dislike') {
            return await postsRepositories.updateLikeToDislike(id, userId)
        } else if(checkOnLike && likeStatus === 'Like') return


        const checkDislike = await postsRepositories.getDislikeStatus(id, userId)
        if(checkDislike && likeStatus === 'None') {
            return await postsRepositories.updateDislikeToNoneStatus(id, userId)
        } else if(checkDislike && likeStatus === 'Like') {
            return await postsRepositories.updateDislikeToLike(id, newLike, userId)
        } else if(checkDislike && likeStatus === 'Dislike') return


        if(likeStatus === 'Like') {
            return await postsRepositories.updateLikeStatus(id, newLike)
        }

        if(likeStatus === 'Dislike') {
            return await postsRepositories.updateDislikeStatus(id, userId)
        }

        if(likeStatus === 'None') return
    },

}