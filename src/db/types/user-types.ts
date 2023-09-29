import {ObjectId} from "mongodb";

export type userAccountDBType = {
    _id: ObjectId,
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmation: boolean
    }
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