import {MongoClient} from "mongodb";
import mongoose from 'mongoose'
import {postTypeInput} from "./types/post-types";
import {postCommentInput} from "./types/comments-types";
import {userAccountDBType} from "./types/user-types";
import {blackListSchema, blogSchema, connectSchema} from "./schemas/schemas";

const mongoUri = process.env.mongoURI || 'mongodb+srv://Julian871:datajulianbase2023@julian871.cehbrfy.mongodb.net/hw3?retryWrites=true&w=majority'

export const client = new MongoClient(mongoUri);
export const db = client.db('hw3')

export const BlogsModel = mongoose.model('blogs', blogSchema)
export const BlackListModel = mongoose.model('blackList', blackListSchema)
export const ConnectModel = mongoose.model('connect', connectSchema)
export const postsCollection = db.collection<postTypeInput>('posts')
export const usersCollection = db.collection<userAccountDBType>('users')
export const postsCommentsCollection = db.collection<postCommentInput>('postsComments')

export async function runDb() {
    try {
        await client.connect()
        await client.db('blogs').command({ping: 1})
        await mongoose.connect(mongoUri)
        console.log('Connected successful to server')
    } catch {
        console.log('Error connect to server')
        await client.close()
        await mongoose.disconnect()
    }
}