import {Request, Response, Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization";
import {usersService} from "../domain/users-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersValidation} from "../middlewares/users/users-validation";
import {RequestQueryParams} from "../db/types/query-types";

export const usersRouter = Router({})

usersRouter.get('/',
    authorizationMiddleware,
    async (req: RequestQueryParams<{}>, res: Response) => {

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
    const isDelete = await usersService.deleteBlogById(req.params.id)
    if (isDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})