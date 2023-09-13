import {ObjectId} from "mongodb";
import {usersCollection} from "../db/db";
import {getUsersQueryType, userTypeInput, userTypeOutput} from "../db/types/user-types";

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
            createAt: p.createAt
        }))
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
            createAt: newUser.createAt
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await usersCollection.deleteOne({_id: _id})
        return result.deletedCount === 1
    }

}