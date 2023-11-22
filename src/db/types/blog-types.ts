import {ObjectId} from "mongodb";

export type blogTypeInput = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type blogTypeOutput = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
    id: string
}

export type blogTypePostPut = {

    name: string,
    description: string,
    websiteUrl: string
}

export type getBlogsQueryType = {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: 1 | -1;
    pageNumber: number;
    pageSize: number;
}

export class BlogCreator {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean

    constructor(name: string, description: string, websiteUrl: string) {
        this._id = new ObjectId()
        this.name = name
        this.description = description
        this.websiteUrl = websiteUrl
        this.createdAt = new Date().toString()
        this.isMembership = false
    }
}

export class BlogInfo {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean

    constructor(id: string, name: string, description: string, websiteUrl: string, createdAt: string, isMembership: boolean) {
        this.id = id
        this.name = name
        this.description = description
        this.websiteUrl = websiteUrl
        this.createdAt = createdAt
        this.isMembership = isMembership
    }
}

