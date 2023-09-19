import {Request, Response, Router} from "express";
import {authValidation} from "../middlewares/auth-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";

export const authRouter = Router({})

authRouter.post('/login',
    authValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
       if(user) {
           const token = await jwtService.createJWT(user)
           res.status(200).send({
               'accessToken': token.toString()
           })
       } else {
           res.sendStatus(401)
       }

})