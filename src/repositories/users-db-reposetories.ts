import {ObjectId} from "mongodb";
import {usersCollection} from "../db/db";
import {userTypeInput, userTypeOutput} from "../db/types/user-types";

export const usersRepositories = {

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