import {AuthService} from "../application/auth-service";
import {UsersService} from "../application/users-service";
import {ConnectService} from "../application/connect-service";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {injectable} from "inversify";


@injectable()
export class AuthController {
    constructor(protected authService: AuthService,
                protected usersService: UsersService,
                protected connectService: ConnectService) {}

    async login(req: Request, res: Response) {
        const user = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtService.createJWT(user)
            const refreshToken = await jwtService.createJWTRefresh(user, req.deviceId)
            await this.usersService.updateUserId(user._id, req.deviceId)
            await this.usersService.updateToken(token, user._id)
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            res.status(200).send({accessToken: token})
            return
        } else {
            res.sendStatus(401)
        }
    }

    async regConfirm(req: Request, res: Response) {
        const user = await this.usersService.checkConfirmationCode(req.body.code, req.deviceId)
        if (user === true) {
            res.sendStatus(204)
        } else {
            res.status(400).send(user)
        }
    }

    async registration(req: Request, res: Response) {
        await this.authService.createUser(req.body.login, req.body.email, req.body.password, req.deviceId)
        return res.sendStatus(204)
    }

    async emailResending(req: Request, res: Response) {
        const user = await this.usersService.checkEmail(req.body.email, req.deviceId)
        if (user === true) {
            res.sendStatus(204)
        } else {
            res.status(400).send(user)
        }
    }

    async refreshToken(req: Request, res: Response) {
        const user = await this.usersService.getUserAllInfo(req.user!)
        if (user === null) {
            res.sendStatus(401)
        } else {
            const token = await jwtService.createJWT(user)
            const deviceId = await jwtService.getDeviceIdRefreshToken(req.cookies.refreshToken)
            const refreshToken = await jwtService.createJWTRefresh(user, deviceId)
            await this.usersService.updateToken(token, user._id)
            await this.usersService.updateBlackList(req.cookies.refreshToken)
            await this.connectService.updateConnectDate(deviceId)
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            res.status(200).send({accessToken: token})
        }
    }

    async me(req: Request, res: Response) {

        const userInformation = await this.usersService.getUserInformation(req.user!)
        if (userInformation === null) {
            res.sendStatus(401)
        } else {
            res.status(200).send(userInformation)
        }
    }

    async logout(req: Request, res: Response) {
        const user = await this.usersService.getUserAllInfo(req.user!)
        if (user === null) {
            res.sendStatus(401)
        } else {
            const deviceId = await jwtService.getDeviceIdRefreshToken(req.cookies.refreshToken)
            await this.connectService.deleteByDeviceId(deviceId)
            await this.usersService.updateBlackList(req.cookies.refreshToken)
            res.sendStatus(204)
        }
    }

    async passwordRecovery(req: Request, res: Response) {
        await this.usersService.sendRecoveryCode(req.body.email)
        return res.sendStatus(204)
    }

    async newPassword(req: Request, res: Response) {
        const updatePassword = await this.usersService.updatePassword(req.body.newPassword, req.body.recoveryCode)
        if (updatePassword !== true) {
            return res.status(400).send(updatePassword)
        } else {
            return res.sendStatus(204)
        }
    }
}