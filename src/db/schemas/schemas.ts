import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {blogTypeInput} from "../types/blog-types";
import {blackList} from "../types/blackList-types";
import {connectType} from "../types/sessions-type";
import {userAccountDBType} from "../types/user-types";
import {postTypeInput} from "../types/post-types";
import {postCommentInput} from "../types/comments-types";


export const blogSchema = new mongoose.Schema<blogTypeInput>({
    _id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})

export const blackListSchema = new mongoose.Schema<blackList>({
    refreshToken: Array
})

export const connectSchema = new mongoose.Schema<connectType>({
    IP: String,
    URL: String,
    lastActiveDate: Number,
    deviceName: String,
    deviceId: String,
    userId: ObjectId || null
})

export const userSchema = new mongoose.Schema<userAccountDBType>({
    _id: ObjectId,
    recoveryCode: String || null,
    accountData: {
        login: String,
        email: String,
        passwordHash: String,
        passwordSalt: String,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmation: Boolean
    },
    token: {
        accessToken: String || null
    }
})

export const postSchema = new mongoose.Schema<postTypeInput>({
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})

export const commentSchema = new mongoose.Schema<postCommentInput>({
    _id: ObjectId,
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String,
    },
    createdAt: String,
    idPost: String,
    likeInfo: {
        countLike: Number,
        countDislike: Number,
        likeList: Array,
        dislikeList: Array
    }
})