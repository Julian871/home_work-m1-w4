import {ObjectId} from "mongodb";
import {BlackListModel, UserModel} from "../db/db";
import {getUsersQueryType, userAccountDBType, userTypeOutput, userTypeOutputAuthMe} from "../db/types/user-types";

export const usersRepositories = {

    async getAllUsers(query: getUsersQueryType): Promise<userTypeOutput[]> {
        const users = await UserModel.find({
            '$or': [
                {'accountData.login': {
                    $regex: query.searchLoginTerm ? query.searchLoginTerm : '', $options: 'i'} },
                {'accountData.email': {
                    $regex: query.searchEmailTerm ? query.searchEmailTerm : '', $options: 'i'} }
            ]
        }).sort({[query.sortBy]: query.sortDirection })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .lean()

        return users.map((p) => ({
            id: p._id.toString(),
            login: p.accountData.login,
            email: p.accountData.email,
            createdAt: p.accountData.createdAt.toISOString()
        }))
    },

    async checkUserByConfirmationCode(code: string) {
        const user = await UserModel.findOne({'emailConfirmation.confirmationCode': code})
        if(!user) {
            return undefined
        } else {
            return user
        }
    },

    async checkUserByEmail(email: string) {
        const user = await UserModel.findOne({'accountData.email': email})
        if(!user) {
            return undefined
        } else {
            return user
        }
    },

    async getUserById(id: ObjectId): Promise<userTypeOutput | null> {
        const user: userAccountDBType | null = await UserModel.findOne({_id: id})
        if (!user) {
            return null
        }
        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt.toISOString()
        }
    },

    async getAllInformationUser(id: ObjectId) {
        const user = await UserModel.findOne({_id: id})
        if(!user) {
            return null
        } else {
            return user
        }
    },


    async getUserInformation(id: any): Promise<userTypeOutputAuthMe | null> {
        const user: userAccountDBType | null = await UserModel.findOne({_id: id})
        if (!user) {
            return null
        }
        return {
            login: user.accountData.login,
            email: user.accountData.email,
            userId: user._id.toString()

        }
    },

    async getUserByEmail(email: string){
        return UserModel.findOne({'accountData.email': email});
    },

    async getUserByLogin(login: string){
        return UserModel.findOne({'accountData.login': login})
    },

    async countUser(query: getUsersQueryType): Promise<number> {
        return UserModel.countDocuments({
            $or: [
                {'accountData.login': {
                        $regex :query.searchLoginTerm ? query.searchLoginTerm : '', $options: 'i'} },
                {'accountData.email': {
                        $regex: query.searchEmailTerm ? query.searchEmailTerm : '',
                        $options: 'i'
                    }}]
        })
    },

    async createNewUser(newUser: userAccountDBType): Promise<userTypeOutput> {

        await UserModel.insertMany(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt.toISOString()
        }
    },

    async createAuthNewUser(newUser: userAccountDBType){

        await UserModel.insertMany(newUser)
        return newUser
    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        return UserModel.findOne({$or: [{'accountData.login': loginOrEmail}, {"accountData.email": loginOrEmail}]})
    },

    async deleteUserById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await UserModel.deleteOne({_id: _id})
        return result.deletedCount === 1
    },

    async updateConfirmStatus(_id: ObjectId) {
        await UserModel.updateOne({_id: _id}, {
            $set: {
                'emailConfirmation.isConfirmation': true
            }})
    },

    async updateConfirmCode(_id: ObjectId, newConfirmationCode: string) {
        await UserModel.updateOne({_id: _id}, {
            $set: {
                'emailConfirmation.confirmationCode': newConfirmationCode
            }})
    },

    async updateToken(token: string, _id: ObjectId) {
        await UserModel.updateOne({_id: _id}, {
            $set: {
                'token.accessToken': token
            }})
    },

    async updateBlackList(refreshToken: string){
        await BlackListModel.insertMany({refreshToken})
    },

    async checkBlackList(refreshToken: string){
        return BlackListModel.findOne({refreshToken: refreshToken});
    },

    async updateRecoveryCode(email: string, newRecoveryCode: string){
        await UserModel.updateOne({'accountData.email': email},{$set: {recoveryCode: newRecoveryCode}})
    },

    async checkRecoveryCode(recoveryCode: string){
        return UserModel.findOne({recoveryCode: recoveryCode})
    },

    async updatePassword(recoveryCode: string, passwordHash: string, passwordSalt: string){
        return UserModel.updateOne({recoveryCode: recoveryCode},
            {$set: {'accountData.passwordHash': passwordHash, 'accountData.passwordSalt': passwordSalt}})
    },

    async invalidRecoveryCode(recoveryCode: string){
        await UserModel.updateOne({recoveryCode: recoveryCode}, {$set: {recoveryCode: null}})
    },
}