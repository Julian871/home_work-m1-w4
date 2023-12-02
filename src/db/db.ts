import mongoose from 'mongoose'
import {blackListSchema, blogSchema, commentSchema, connectSchema, postSchema, userSchema} from "./schemas";

const mongoURI = process.env.mongoURI || 'mongodb+srv://Julian871:datajulianbase2023@julian871.cehbrfy.mongodb.net/hw3?retryWrites=true&w=majority'

export const BlogsModel = mongoose.model('blogs', blogSchema)
export const BlackListModel = mongoose.model('blackList', blackListSchema)
export const ConnectModel = mongoose.model('connects', connectSchema)
export const UserModel = mongoose.model('users', userSchema)
export const PostModel = mongoose.model('posts', postSchema)
export const CommentModel = mongoose.model('comments', commentSchema)

export async function runDb() {
    try {
        await mongoose.connect(mongoURI)
        console.log('Connected successful to server')
    } catch {
        console.log('Error connect to server')
        await mongoose.disconnect()
    }
}