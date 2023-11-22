import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";
import {usersRepositories} from "../repositories/users-db-repositories";
import {connectRepositories} from "../repositories/connect-repositories";

export const authorizationMiddleware = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
        return res.sendStatus(401)

    } else {
        return next();
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdToken(token)
    if (userId) {
        req.user = await usersService.getUserById(userId)
        next()
        return
    }
    res.sendStatus(401)
}

export const authCookie = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.refreshToken) {
        res.status(401).send('no refresh token')
        return
    }

    const deviceId = await jwtService.getDeviceIdRefreshToken(req.cookies.refreshToken)
    const checkDeviceId = await connectRepositories.findDeviceId(deviceId)
    if (!checkDeviceId) {
        return res.status(401).send('no device id in db')
    }


    const userId = await jwtService.getUserIdRefreshToken(req.cookies.refreshToken)
    if (userId === null) {
        res.status(401).send('no userID')
        return
    }
    const checkResult = await usersRepositories.checkBlackList(req.cookies.refreshToken)

    if (checkResult) {
        res.status(401).send('in black list')
        return
    } else {
        req.user = await usersService.getUserById(userId)
        next()
        return
    }
}