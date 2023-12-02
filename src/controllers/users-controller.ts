import {UsersService} from "../domain/users-service";
import {RequestQueryParams} from "../db/types/query-types";
import {Request, Response} from "express";
import {getPaginationData} from "../utils/pagination.utility";
import {getSortUsersQuery} from "../utils/users-query.utility";


export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async getUsers(req: RequestQueryParams<{
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    }>, res: Response) {

        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);
        const usersQuery = getSortUsersQuery(req.query.sortBy, req.query.sortDirection, req.query.searchLoginTerm, req.query.searchEmailTerm)

        const userList = await this.usersService.getAllUsers({
            ...usersQuery,
            ...pagination
        })
        res.send(userList)
    }

    async createUser(req: Request, res: Response) {
        const newUsers = await this.usersService.createNewUser(req.body)
        res.status(201).send(newUsers)
    }

    async deleteUser(req: Request, res: Response) {
        const isDelete = await this.usersService.deleteBlogById(req.params.id)
        if (isDelete) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}