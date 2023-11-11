import {ObjectId} from "mongodb";

export type postCommentOutput = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
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
    likeStatus: string
}

export type postCommentPut = {
    content: string
}