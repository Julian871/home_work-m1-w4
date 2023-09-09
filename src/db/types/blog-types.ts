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

