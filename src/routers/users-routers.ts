import {Request, Response, Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization";
import {UsersService} from "../domain/users-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersValidation} from "../middlewares/users/users-validation";
import {RequestQueryParams} from "../db/types/query-types";
import {getPaginationData} from "../utils/pagination.utility";
import {getSortUsersQuery} from "../utils/users-query.utility";
import {checkValidParams} from "../middlewares/auth";
import {usersController} from "../composition-root";

export const usersRouter = Router({})

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

usersRouter
    .get('/', authorizationMiddleware, usersController.getUsers.bind(usersController))
    .post('/', authorizationMiddleware, usersValidation, inputValidationMiddleware, usersController.createUser.bind(usersController))
    .delete('/:id', checkValidParams, inputValidationMiddleware, authorizationMiddleware, usersController.deleteUser.bind(usersController))