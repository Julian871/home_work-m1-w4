import {ObjectId} from "mongodb";

export type postTypeInput = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        countLike: number,
        countDislike: number,
        likeList:[],
        dislikeList:[]
    }
}

export type postTypeOutput = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: any
    }
}

export type postTypePostPut = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type getPostsQueryType = {
    sortBy: string;
    sortDirection: 1 | -1;
    pageNumber: number;
    pageSize: number;
}
