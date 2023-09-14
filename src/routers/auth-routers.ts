import {Request, Response, Router} from "express";
import {authValidation} from "../middlewares/auth-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersService} from "../domain/users-service";

export const authRouter = Router({})

authRouter.post('',
    authValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
       if(checkResult) {
           res.sendStatus(204)
       }
       res.sendStatus(401)
})