import {usersRepositories} from "../repositories/users-db-repositories";
import {
    getUsersQueryType,
    userAccountDBType, UserInfo,
    userTypeOutput,
    userTypePostPut
} from "../db/types/user-types";
import {ObjectId, WithId} from "mongodb";
import {headTypes, PageInfo} from "../db/types/head-types";
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailManager} from "../manegers/email-meneger";
import {connectRepositories} from "../repositories/connect-repositories";


export const usersService = {

    async getAllUsers(query: getUsersQueryType): Promise<headTypes> {
        const usersCount = await usersRepositories.countUser(query)
        const allUsers = await usersRepositories.getAllUsers(query)
        const filterUsers = allUsers.map((p) => (
            new UserInfo(p._id.toString(), p.accountData.login, p.accountData.email, p.accountData.createdAt.toString())
        ))
        return new PageInfo(query.pageNumber, query.pageSize, usersCount, filterUsers)
    },

    async getUserInformation(user: userTypeOutput) {
        const userInfo = await usersRepositories.getUserInformation(user.id)
        if (!userInfo) {
            return null
        }
        return {
            login: userInfo.accountData.login,
            email: userInfo.accountData.email,
            userId: userInfo._id.toString()
        }
    },

    async getUserById(id: ObjectId) {
        const user = await usersRepositories.getUserById(id)
        if (!user) {
            return null
        }
        return new UserInfo(user._id.toString(), user.accountData.login, user.accountData.email, user.accountData.createdAt.toString())
    },

    async getUserAllInfo(user: userTypeOutput): Promise<userAccountDBType | null> {
        const userInfo = await usersRepositories.getAllInformationUser(user.id)
        if (!userInfo) {
            return null
        } else {
            return userInfo
        }
    },

    async createNewUser(data: userTypePostPut): Promise<userTypeOutput> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(data.password, passwordSalt)

        const newUser: userAccountDBType = {
            _id: new ObjectId(),
            recoveryCode: null,
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
            },
            token: {
                accessToken: null
            }
        }
        await usersRepositories.createNewUser(newUser)
        return new UserInfo(newUser._id.toString(), newUser.accountData.login, newUser.accountData.email, newUser.accountData.createdAt.toISOString())
    },

    async checkConfirmationCode(code: string, deviceId: string) {
        const confirmStatus = await usersRepositories.checkUserByConfirmationCode(code)
        if (confirmStatus === undefined) {
            return {errorsMessages: [{message: 'Incorrect code', field: "code"}]}
        } else if (!confirmStatus.emailConfirmation.isConfirmation) {
            await connectRepositories.updateUserId(confirmStatus._id, deviceId)
            await emailManager.sendConfirmationLink(confirmStatus.accountData.email, confirmStatus.emailConfirmation.confirmationCode)
            await usersRepositories.updateConfirmStatus(confirmStatus._id)
            return true
        } else {
            return {errorsMessages: [{message: 'code confirm', field: "code"}]}
        }
    },

    async checkEmail(email: string, deviceId: string) {
        const user = await usersRepositories.checkUserByEmail(email)
        const newConfirmationCode = uuidv4()
        if (user === undefined) {
            return {errorsMessages: [{message: 'Incorrect email', field: "email"}]}
        } else if (!user.emailConfirmation.isConfirmation) {
            await connectRepositories.updateUserId(user._id, deviceId)
            await emailManager.sendConfirmationLink(user.accountData.email, newConfirmationCode)
            await usersRepositories.updateConfirmCode(user._id, newConfirmationCode)
            return true
        } else {
            return {errorsMessages: [{message: 'no confirm', field: "email"}]}
        }
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<userAccountDBType> | null> {
        const user = await usersRepositories.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return null
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) {
            return null
        }
        return user;

    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await usersRepositories.deleteUserById(id)
    },

    async sendRecoveryCode(email: string) {
        const newRecoveryCode = uuidv4()
        await emailManager.sendRecoveryCode(email, newRecoveryCode)
        await usersRepositories.updateRecoveryCode(email, newRecoveryCode)
    },

    async updatePassword(newPassword: string, recoveryCode: string) {
        const checkRecoveryCode = await usersRepositories.checkRecoveryCode(recoveryCode)
        if (!checkRecoveryCode) {
            return {
                "errorsMessages": [
                    {
                        "message": "recovery code incorrect",
                        "field": "recoveryCode"
                    }
                ]
            }
        }

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(newPassword, passwordSalt)
        await usersRepositories.updatePassword(recoveryCode, passwordHash, passwordSalt)
        await usersRepositories.invalidRecoveryCode(recoveryCode)
        return true

    },
}