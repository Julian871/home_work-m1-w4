import {ObjectId} from "mongodb";
import {usersCollection} from "../db/db";
import {getUsersQueryType, userAccountDBType, userTypeInput, userTypeOutput} from "../db/types/user-types";

export const usersRepositories = {

    async getAllUsers(query: getUsersQueryType): Promise<userTypeOutput[]> {
        const users = await usersCollection.find({
            $or: [
                {login: {
                    $regex :query.searchLoginTerm ? query.searchLoginTerm : '', $options: 'i'} },
                {email: {
                    $regex: query.searchEmailTerm ? query.searchEmailTerm : '',
                    $options: 'i'
                }}]
        }).sort({[query.sortBy]: query.sortDirection })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return users.map((p) => ({
            id: p._id.toString(),
            login: p.login,
            email: p.email,
            createdAt: p.createdAt
        }))
    },

    async getUserById(id: ObjectId): Promise<userTypeOutput | null> {
        const user: userTypeInput | null = await usersCollection.findOne({_id: id})
        if (!user) {
            return null
        }
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
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
                {login: {
                        $regex :query.searchLoginTerm ? query.searchLoginTerm : '', $options: 'i'} },
                {email: {
                        $regex: query.searchEmailTerm ? query.searchEmailTerm : '',
                        $options: 'i'
                    }}]
        })
    },

    async createNewUser(newUser: userTypeInput): Promise<userTypeOutput> {

        await usersCollection.insertOne(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    },

    async createAuthNewUser(newUser: userAccountDBType){

        await usersCollection.insertOne(newUser)
        return newUser
    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        console.log(loginOrEmail)
        return usersCollection.findOne({$or: [{'accountData.login': loginOrEmail}, {"accountData.email": loginOrEmail}]})
    },

    async deleteUserById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await usersCollection.deleteOne({_id: _id})
        return result.deletedCount === 1
    }

}