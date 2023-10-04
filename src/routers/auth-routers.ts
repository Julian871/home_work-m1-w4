import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";
import {usersValidation} from "../middlewares/users/users-validation";
import {authAccessToken, authCode, authEmail, authValidation} from "../middlewares/auth";
import {usersRepositories} from "../repositories/users-db-repositories";


export const authRouter = Router({})

authRouter
    .post('/login',
        authValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (user) {
                const token = await jwtService.createJWT(user)
                const refreshToken = await jwtService.createJWTRefresh(user)
                await usersRepositories.updateToken(token, refreshToken, user._id)
                res.cookie('refresh token', refreshToken, {httpOnly: true, secure: true})
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
            } else {res.status(400).send(user)}
        })

    .post('/registration',
        usersValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            await authService.createUser(req.body.login, req.body.email, req.body.password)
           return res.sendStatus(204)
        })

    .post('/registration-email-resending',
        authEmail,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const user = await usersService.checkEmail(req.body.email)
            if (user === true) {
                res.sendStatus(204)
            } else {res.status(400).send(user)}
        })

    .post('/refresh-token',
    authAccessToken,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const user = await usersService.getUserByAccessToken(req.body.accessToken)
        if(user === null) {
            res.sendStatus(404)
        } else if (refreshToken == user.token.refreshToken) {
            const token = await jwtService.createJWT(user)
            const refreshToken = await jwtService.createJWTRefresh(user)
            await usersRepositories.updateToken(token, refreshToken, user._id)
            await usersRepositories.updateBlackList(refreshToken)
            res.cookie('refresh token', refreshToken, {httpOnly: true, secure: true})
            res.status(200).send({accessToken: token})

        } else {
            res.sendStatus(401)
        }
    })
