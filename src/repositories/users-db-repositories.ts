import {ObjectId} from "mongodb";
import {usersCollection} from "../db/db";
import {getUsersQueryType, userAccountDBType, userTypeOutput} from "../db/types/user-types";

export const usersRepositories = {

    async getAllUsers(query: getUsersQueryType): Promise<userTypeOutput[]> {
        const users = await usersCollection.find({
            '$or': [
                {'accountData.login': {
                    $regex: query.searchLoginTerm ? query.searchLoginTerm : '', $options: 'i'} },
                {'accountData.email': {
                    $regex: query.searchEmailTerm ? query.searchEmailTerm : '', $options: 'i'} }
            ]
        }).sort({[query.sortBy]: query.sortDirection })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return users.map((p) => ({
            id: p._id.toString(),
            login: p.accountData.login,
            email: p.accountData.email,
            createdAt: p.accountData.createdAt.toISOString()
        }))
    },

    async checkUserByConfirmationCode(code: string) {
        const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
        if(!user) {
            return undefined
        } else {
            return user
        }
    },

    async checkConfirmationStatus(email: string) {
        const user = await usersCollection.findOne({'accountData.email': email})
        if(!user) {
            return undefined
        } else {
            return user
        }
    },

    async getUserById(id: ObjectId): Promise<userTypeOutput | null> {
        const user: userAccountDBType | null = await usersCollection.findOne({_id: id})
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

    async getUserByEmail(email: string){
        return await usersCollection.findOne({'accountData.email': email})
    },

    async getUserByLogin(login: string){
        return await usersCollection.findOne({'accountData.login': login})
    },

    async countUser(query: getUsersQueryType): Promise<number> {
        return usersCollection.countDocuments({
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

        await usersCollection.insertOne(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt.toISOString()
        }
    },

    async createAuthNewUser(newUser: userAccountDBType){

        await usersCollection.insertOne(newUser)
        return newUser
    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        return usersCollection.findOne({$or: [{'accountData.login': loginOrEmail}, {"accountData.email": loginOrEmail}]})
    },

    async deleteUserById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await usersCollection.deleteOne({_id: _id})
        return result.deletedCount === 1
    },

    async updateConfirmStatus(_id: ObjectId) {
        await usersCollection.updateOne({_id: _id}, {
            $set: {
                'emailConfirmation.isConfirmation': true
            }})
    }
}