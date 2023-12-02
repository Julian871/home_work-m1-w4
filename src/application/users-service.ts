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
import {emailManager} from "../email/email-meneger";
import {UsersRepository} from "../repositories/users-repository";
import {ConnectRepository} from "../repositories/connect-repository";
import {injectable} from "inversify";


@injectable()
export class UsersService {
    constructor(protected usersRepositories: UsersRepository,
    protected connectRepositories: ConnectRepository) {}

    async getAllUsers(query: getUsersQueryType): Promise<headTypes> {
        const usersCount = await this.usersRepositories.countUser(query)
        const allUsers = await this.usersRepositories.getAllUsers(query)
        const filterUsers = allUsers.map((p) => (
            new UserInfo(p._id.toString(), p.accountData.login, p.accountData.email, p.accountData.createdAt.toString())
        ))
        return new PageInfo(query.pageNumber, query.pageSize, usersCount, filterUsers)
    }

    async getUserInformation(user: userTypeOutput) {
        const userInfo = await this.usersRepositories.getUserInformation(user.id)
        if (!userInfo) {
            return null
        }
        return {
            login: userInfo.accountData.login,
            email: userInfo.accountData.email,
            userId: userInfo._id.toString()
        }
    }

    async getUserById(id: ObjectId) {
        const user = await this.usersRepositories.getUserById(id)
        if (!user) {
            return null
        }
        return new UserInfo(user._id.toString(), user.accountData.login, user.accountData.email, user.accountData.createdAt.toString())
    }

    async getUserByLogin(login: any) {
        return await this.usersRepositories.getUserByLogin(login)
    }

    async getUserByEmail(email: any) {
        return await this.usersRepositories.getUserByEmail(email)
    }

    async getUserAllInfo(user: userTypeOutput): Promise<userAccountDBType | null> {
        const userInfo = await this.usersRepositories.getAllInformationUser(user.id)
        if (!userInfo) {
            return null
        } else {
            return userInfo
        }
    }

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
        await this.usersRepositories.createNewUser(newUser)
        return new UserInfo(newUser._id.toString(), newUser.accountData.login, newUser.accountData.email, newUser.accountData.createdAt.toISOString())
    }

    async checkConfirmationCode(code: string, deviceId: string) {
        const confirmStatus = await this.usersRepositories.checkUserByConfirmationCode(code)
        if (confirmStatus === undefined) {
            return {errorsMessages: [{message: 'Incorrect code', field: "code"}]}
        } else if (!confirmStatus.emailConfirmation.isConfirmation) {
            await this.connectRepositories.updateUserId(confirmStatus._id, deviceId)
            await emailManager.sendConfirmationLink(confirmStatus.accountData.email, confirmStatus.emailConfirmation.confirmationCode)
            await this.usersRepositories.updateConfirmStatus(confirmStatus._id)
            return true
        } else {
            return {errorsMessages: [{message: 'code confirm', field: "code"}]}
        }
    }

    async checkEmail(email: string, deviceId: string) {
        const user = await this.usersRepositories.checkUserByEmail(email)
        const newConfirmationCode = uuidv4()
        if (user === undefined) {
            return {errorsMessages: [{message: 'Incorrect email', field: "email"}]}
        } else if (!user.emailConfirmation.isConfirmation) {
            await this.connectRepositories.updateUserId(user._id, deviceId)
            await emailManager.sendConfirmationLink(user.accountData.email, newConfirmationCode)
            await this.usersRepositories.updateConfirmCode(user._id, newConfirmationCode)
            return true
        } else {
            return {errorsMessages: [{message: 'no confirm', field: "email"}]}
        }
    }

    async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<userAccountDBType> | null> {
        const user = await this.usersRepositories.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return null
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) {
            return null
        }
        return user;

    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    async deleteBlogById(id: string): Promise<boolean> {
        return await this.usersRepositories.deleteUserById(id)
    }

    async sendRecoveryCode(email: string) {
        const newRecoveryCode = uuidv4()
        await emailManager.sendRecoveryCode(email, newRecoveryCode)
        await this.usersRepositories.updateRecoveryCode(email, newRecoveryCode)
    }

    async updatePassword(newPassword: string, recoveryCode: string) {
        const checkRecoveryCode = await this.usersRepositories.checkRecoveryCode(recoveryCode)
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
        await this.usersRepositories.updatePassword(recoveryCode, passwordHash, passwordSalt)
        await this.usersRepositories.invalidRecoveryCode(recoveryCode)
        return true

    }

    async updateUserId(userId: ObjectId, deviceId: string) {
        await this.connectRepositories.updateUserId(userId, deviceId)
    }

    async updateToken(token: string, id: ObjectId) {
        await this.usersRepositories.updateToken(token, id)
    }

    async updateBlackList(token: string) {
        await this.usersRepositories.updateBlackList(token)
    }

    async checkBlackList(token: string) {
        return await this.usersRepositories.checkBlackList(token)
    }
}