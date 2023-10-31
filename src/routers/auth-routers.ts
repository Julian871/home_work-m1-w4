import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";
import {usersValidation} from "../middlewares/users/users-validation";
import {authCode, authEmail, authValidation} from "../middlewares/auth";
import {usersRepositories} from "../repositories/users-db-repositories";
import {authCookie, authMiddleware} from "../middlewares/authorization";
import {checkConnect} from "../middlewares/checkConnect";
import {connectService} from "../domain/connect-service";
import {connectRepositories} from "../repositories/connect-repositories";


export const authRouter = Router({})

authRouter
    .post('/login',
        checkConnect,
        authValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (user) {
                const token= await jwtService.createJWT(user)
                const refreshToken = await jwtService.createJWTRefresh(user, req.connectInfo.deviceId)
                await usersRepositories.updateToken(token, user._id)
                await connectRepositories.updateUserId(req.connectInfo.specialId, user._id)
                res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
                res.status(200).send({accessToken: token})
                return
            } else {
                res.sendStatus(401)
            }
    })

    .post('/registration-confirmation',
        checkConnect,
        authCode,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
        const user = await usersService.checkConfirmationCode(req.body.code, req.connectInfo.specialId)
            if (user === true) {
                res.sendStatus(204)
            } else {res.status(400).send(user)}
    })

    .post('/registration',
        checkConnect,
        usersValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            await authService.createUser(req.body.login, req.body.email, req.body.password)
            const isGood = await connectService.updateUserId(req.connectInfo.specialId, req.body.login)
            if(isGood) {
                return res.sendStatus(204)
            }
           return res.sendStatus(204)
    })

    .post('/registration-email-resending',
        checkConnect,
        authEmail,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const user = await usersService.checkEmail(req.body.email, req.connectInfo.specialId)
            if (user === true) {
                res.sendStatus(204)
            } else {res.status(400).send(user)}
    })

    .post('/refresh-token',
    authCookie,
    async (req: Request, res: Response) => {
        const user = await usersService.getUserAllInfo(req.user!)
        if(user === null) {
            res.sendStatus(401)
        } else {
            const token = await jwtService.createJWT(user)
            const deviceId = await jwtService.getDeviceIdRefreshToken(req.cookies.refreshToken)
            const refreshToken = await jwtService.createJWTRefresh(user, deviceId)
            await connectService.updateDate(deviceId)
            await connectRepositories.updateUserId(req.connectInfo.specialId, user._id)
            await usersRepositories.updateToken(token, user._id)
            await usersRepositories.updateBlackList(req.cookies.refreshToken)
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            res.status(200).send({accessToken: token})
        }
    })

    .get('/me',
        authMiddleware,
        async (req: Request, res: Response) => {

        const userInformation = await usersService.getUserInformation(req.user!)
            if(userInformation === null) {
                res.sendStatus(401)
            } else {
                res.status(200).send(userInformation)
            }
    })

    .post('/logout',
        authCookie,
        async (req: Request, res: Response) => {
            const user = await usersService.getUserAllInfo(req.user!)
            if(user === null) {
                res.sendStatus(401)
            } else {
                await usersRepositories.updateBlackList(req.cookies.refreshToken)
                res.sendStatus(204)
            }
    })



