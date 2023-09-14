import {authTypePost} from "../db/types/auth-types";


export const authRepositories= {
    async createAuth(password: string, loginOrEmail: string) {
        const createAuth: authTypePost = {
            loginOrEmail,
            password
        }

        return createAuth
    }
}