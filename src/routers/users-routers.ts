import {Request, Response, Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization";
import {usersService} from "../domain/users-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersValidation} from "../middlewares/users/users-validation";
import {RequestQueryParams} from "../db/types/query-types";
import {getPaginationData} from "../utils/pagination.utility";
import {getSortUsersQuery} from "../utils/users-query.utility";
import {ObjectId} from "mongodb";

export const usersRouter = Router({})

usersRouter.get('/',
    authorizationMiddleware,
    async (req: RequestQueryParams<{searchLoginTerm: string | null, searchEmailTerm: string | null, sortBy: string, sortDirection: string, pageNumber: number, pageSize: number}>, res: Response) => {

        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);
        const usersQuery = getSortUsersQuery(req.query.sortBy, req.query.sortDirection, req.query.searchLoginTerm, req.query.searchEmailTerm)

        const userList = await usersService.getAllUsers({
            ...usersQuery,
            ...pagination
        })
        res.send(userList)
})


usersRouter.post('/',
    authorizationMiddleware,
    usersValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newUsers = await usersService.createNewUser(req.body)
        res.status(201).send(newUsers)
})



usersRouter.delete('/:id', authorizationMiddleware, async (req: Request, res: Response) => {
    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }
    const isDelete = await usersService.deleteBlogById(req.params.id)
    if (isDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})