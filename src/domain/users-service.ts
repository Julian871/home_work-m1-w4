import {usersRepositories} from "../repositories/users-db-repositories";
import {getUsersQueryType, userAccountDBType, userTypeOutput, userTypePostPut} from "../db/types/user-types";
import {ObjectId, WithId} from "mongodb";
import {headTypes} from "../db/types/head-types";
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailManager} from "../manegers/email-meneger";



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

        const newUser: userAccountDBType = {
            _id: new ObjectId(),
            accountData: {
                login: data.login,
                email: data.email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmation: false
            }
        }
        return usersRepositories.createNewUser(newUser)
    },

    async checkConfirmationCode(code: string) {
        const user = await usersRepositories.checkUserByConfirmationCode(code)
        if(user === null) {
            return false
        } else {
            await emailManager.sendConfirmationLink(user.accountData.email, user.emailConfirmation.confirmationCode)
            await usersRepositories.updateConfirmStatus(user._id)
            return true
        }
    },

    async checkEmail(email: string) {
        const user = await usersRepositories.checkUserByEmail(email)
        if(user === null) {
            return false
        } else {
            await emailManager.sendConfirmationCode(user.accountData.email, user.emailConfirmation.confirmationCode)
            return true
        }
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<userAccountDBType> | null> {
        const user = await usersRepositories.findUserByLoginOrEmail(loginOrEmail)
        if(!user) return null
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
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