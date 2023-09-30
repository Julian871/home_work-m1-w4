import {Request, Response, Router} from "express";
import {authValidation} from "../middlewares/auth-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";
import {usersValidation} from "../middlewares/users/users-validation";
import {authRegistrationConfirm} from "../middlewares/auth-registration-confirm";


export const authRouter = Router({})

authRouter
    .post('/login',
        authValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (user) {
                const token = await jwtService.createJWT(user)
                res.status(200).send({accessToken: token})
            } else {
                res.sendStatus(401)
            }
        })

    .post('/registration-confirmation',
        authRegistrationConfirm,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
        const result = await usersService.checkConfirmationCode(req.body.code)
            if (result) {res.sendStatus(204)}
        })

    .post('/registration',
        usersValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            await authService.createUser(req.body.login, req.body.email, req.body.password)
            res.sendStatus(204)
        })

/*
    .post('/registration-email-resending',
        async (req: Request, res: Response) => {

        });*/
