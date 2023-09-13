import {usersRepositories} from "../repositories/users-db-reposetories";
import {userTypeInput, userTypeOutput, userTypePostPut} from "../db/types/user-types";
import {ObjectId} from "mongodb";


export const usersService = {

    async createNewUser(data: userTypePostPut): Promise<userTypeOutput> {
        const newUser: userTypeInput = {
            _id: new ObjectId(),
            ...data,
            createAt: new Date().toISOString()

        }
        return usersRepositories.createNewUser(newUser)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await usersRepositories.deleteUserById(id)
    }
}