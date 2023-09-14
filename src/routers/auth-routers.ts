import {Request, Response, Router} from "express";
import {authValidation} from "../middlewares/auth-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authReposetories} from "../repositories/auth-db-reposetories";

export const authRouter = Router({})

authRouter.post('',
    authValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const newAuth = await authReposetories.createAuth(req.body.password, req.body.loginOrEmail)
        res.status(204).send(newAuth)
})