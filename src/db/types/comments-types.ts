import {ObjectId} from "mongodb";

export type postCommentOutput = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likeInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
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
    likeInfo: {
        countLike: number,
        countDislike: number,
        likeList:[],
        dislikeList:[]
    }
}

export type postCommentPut = {
    content: string
}