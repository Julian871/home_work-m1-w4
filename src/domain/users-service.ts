import {usersRepositories} from "../repositories/users-db-reposetories";
import {getUsersQueryType, userTypeInput, userTypeOutput, userTypePostPut} from "../db/types/user-types";
import {ObjectId} from "mongodb";
import {headTypes} from "../db/types/head-types";



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