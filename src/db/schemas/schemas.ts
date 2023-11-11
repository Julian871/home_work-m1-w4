import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {blogTypeInput} from "../types/blog-types";
import {blackList} from "../types/blackList-types";
import {connectType} from "../types/sessions-type";


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