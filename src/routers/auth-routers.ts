import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";
import {usersValidation} from "../middlewares/users/users-validation";
import {authCode, authEmail, authRecoverPassword, authRecoveryEmail, authValidation} from "../middlewares/auth";
import {usersRepositories} from "../repositories/users-db-repositories";
import {authCookie, authMiddleware} from "../middlewares/authorization";
import {checkConnect} from "../middlewares/connect";
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
                const refreshToken = await jwtService.createJWTRefresh(user, req.deviceId)
                await connectRepositories.updateUserId(user._id, req.deviceId)
                await usersRepositories.updateToken(token, user._id)
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
        const user = await usersService.checkConfirmationCode(req.body.code, req.deviceId)
            if (user === true) {
                res.sendStatus(204)
            } else {res.status(400).send(user)}
    })

    .post('/registration',
        checkConnect,
        usersValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            await authService.createUser(req.body.login, req.body.email, req.body.password, req.deviceId)
           return res.sendStatus(204)
    })

    .post('/registration-email-resending',
        checkConnect,
        authEmail,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const user = await usersService.checkEmail(req.body.email, req.deviceId)
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
            await usersRepositories.updateToken(token, user._id)
            await usersRepositories.updateBlackList(req.cookies.refreshToken)
            await connectRepositories.updateConnectDate(deviceId)
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
                const deviceId = await jwtService.getDeviceIdRefreshToken(req.cookies.refreshToken)
                await connectRepositories.deleteByDeviceId(deviceId)
                await usersRepositories.updateBlackList(req.cookies.refreshToken)
                res.sendStatus(204)
            }
    })

    .post('/password-recovery',
        checkConnect,
        authRecoveryEmail,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
        await usersService.sendPasswordRecovery(req.body.email)
            return res.sendStatus(204)
    })

    .post('/new-password',
        checkConnect,
        authRecoverPassword,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
        const confirmationPassword = await usersService.checkRecoveryCode(req.body.password, req.body.recoveryCode)
            if(!confirmationPassword){
                return res.sendStatus(400)
            } else {
                return res.sendStatus(204)
            }

    })


