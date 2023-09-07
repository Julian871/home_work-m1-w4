import {ObjectId} from "mongodb";

export type postTypeInput = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type postTypeOutput = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type postTypePostPut = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}