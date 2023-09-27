import {ObjectId} from "mongodb";

export type userAccountDBType = {
    _id: ObjectId,
    accountData: {
        userName: string,
        email: string,
        passwordHash: string,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmation: boolean
    }
}

export type userTypeInput = {
    _id: ObjectId,
    login: string,
    email: string,
    createdAt: string,
    passwordHash: string,
    passwordSalt: string
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