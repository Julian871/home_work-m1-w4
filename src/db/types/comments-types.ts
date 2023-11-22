import {ObjectId} from "mongodb";

export type postCommentOutput = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
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
    likesInfo: {
        countLike: number,
        countDislike: number,
        likeList: object,
        dislikeList: object
    }
}

export type postCommentPut = {
    content: string
}

export class CommentCreator {
    _id: ObjectId
    content: string
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string
    idPost: string
    likesInfo: {
        countLike: number,
        countDislike: number,
        likeList: object,
        dislikeList: object

    }

    constructor(content: string, userId: string, userLogin: string, idPost: string) {
        this._id = new ObjectId()
        this.content = content
        this.commentatorInfo = {
            userId: userId,
            userLogin: userLogin
        }
        this.createdAt = new Date().toISOString()
        this.idPost = idPost
        this.likesInfo = {
            countLike: 0,
            countDislike: 0,
            likeList: [],
            dislikeList: []
        }
    }
}

export class CommentInfo {
    id: string
    content: string
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
    }

    constructor(id: string, content: string, userId: string, userLogin: string,
                createdAt: string, likesCount: number, dislikesCount: number, myStatus: string) {
        this.id = id
        this.content = content
        this.commentatorInfo = {
            userId: userId,
            userLogin: userLogin
        }
        this.createdAt = createdAt
        this.likesInfo = {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus
        }
    }
}