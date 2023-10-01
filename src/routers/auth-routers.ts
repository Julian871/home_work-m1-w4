import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";
import {usersValidation} from "../middlewares/users/users-validation";
import {authCode, authEmail, authValidation} from "../middlewares/auth";


export const authRouter = Router({})

authRouter
    .post('/login',
        authValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            /*console.log('user: ', user)
            console.log('loginOrEmail: ', req.body.loginOrEmail)
            console.log('password', req.body.password)*/
            if (user) {
                const token = await jwtService.createJWT(user)
                res.status(200).send({accessToken: token})
            } else {
                res.sendStatus(401)
            }
        })

    .post('/registration-confirmation',
        authCode,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
        const user = await usersService.checkConfirmationCode(req.body.code)
            if (user === true) {
                res.sendStatus(204)
            } else {res.status(404).send(user)}
        })

    .post('/registration',
        usersValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            await authService.createUser(req.body.login, req.body.email, req.body.password)
            res.sendStatus(204)
        })

    .post('/registration-email-resending',
        authEmail,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const user = await usersService.checkEmail(req.body.email)
            if (user === true) {
                res.sendStatus(204)
            } else {res.status(400).send(user)}
        });
