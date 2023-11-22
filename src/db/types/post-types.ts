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
        likeList: [],
        dislikeList: []
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

export class PostCreator {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: {
        countLike: number,
        countDislike: number,
        likeList: [],
        dislikeList: []
    }

    constructor(title: string, shortDescription: string, content: string, blogId: string,) {
        this._id = new ObjectId()
        this.title = title
        this.shortDescription = shortDescription
        this.content = content
        this.blogId = blogId
        this.blogName = (Math.random() * 100).toString()
        this.createdAt = new Date().toISOString()
        this.extendedLikesInfo = {
            countLike: 0,
            countDislike: 0,
            likeList: [],
            dislikeList: []
        }
    }
}

export class PostInfo {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
        newestLikes: any
    }

    constructor(id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string,
                createdAt: string, likesCount: number, dislikesCount: number, myStatus: string, newestLikes: any) {
        this.id = id
        this.title = title
        this.shortDescription = shortDescription
        this.content = content
        this.blogId = blogId
        this.blogName = blogName
        this.createdAt = createdAt
        this.extendedLikesInfo = {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
            newestLikes: newestLikes
        }
    }
}
