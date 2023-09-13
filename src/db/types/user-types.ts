import {ObjectId} from "mongodb";

export type userTypeInput = {
    _id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}

export type userTypeOutput = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type userTypePostPut = {
    login: string,
    email: string,
    password: string
}

export type getUsersQueryType = {
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
    sortBy: string;
    sortDirection: 1 | -1;
    pageNumber: number;
    pageSize: number;
}