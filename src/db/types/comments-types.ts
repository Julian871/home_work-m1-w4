import {ObjectId} from "mongodb";

export type postCommentOutput = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: [] | undefined
    }
}

export type postCommentInput = {
    _id: ObjectId
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
    idPost: string
    likesInfo: {
        countLike: number,
        countDislike: number,
        likeList:[],
        dislikeList:[]
    }
}

export type postCommentPut = {
    content: string
}