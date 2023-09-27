import {usersRepositories} from "../repositories/users-db-repositories";
import {getUsersQueryType, userTypeInput, userTypeOutput, userTypePostPut} from "../db/types/user-types";
import {ObjectId, WithId} from "mongodb";
import {headTypes} from "../db/types/head-types";
import bcrypt from 'bcrypt'



export const usersService = {

    async getAllUsers(query: getUsersQueryType): Promise<headTypes> {
        const usersCount = await usersRepositories.countUser(query)
        const filterUsers = await usersRepositories.getAllUsers(query)
        return {
            pagesCount: Math.ceil(usersCount / query.pageSize),
            page: +query.pageNumber,
            pageSize: +query.pageSize,
            totalCount: usersCount,
            items: filterUsers
        }
    },

    async getUserById(id: ObjectId): Promise<userTypeOutput | null> {
        return await usersRepositories.getUserById(id)
    },

    async createNewUser(data: userTypePostPut): Promise<userTypeOutput> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(data.password, passwordSalt)

        const newUser: userTypeInput = {
            _id: new ObjectId(),
            ...data,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()

        }
        return usersRepositories.createNewUser(newUser)
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<userTypeInput> | null> {
        const user = await usersRepositories.findUserByLoginOrEmail(loginOrEmail)
        if(!user) return null
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        console.log(passwordHash)
        if(user.accountData.passwordHash !== passwordHash){
            return null
        }
        return user;

    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },
    async deleteBlogById(id: string): Promise<boolean> {
        return await usersRepositories.deleteUserById(id)
    }
}