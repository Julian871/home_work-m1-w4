import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";
import {usersRepositories} from "../repositories/users-db-repositories";

export const authorizationMiddleware = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    if(req.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
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
    if(userId) {
        req.user = await usersService.getUserById(userId)
        next()
        return
    }
    res.sendStatus(401)
}

export const authCookie = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.refreshToken) {
        res.sendStatus(401)
        return
    }

    const userId = await jwtService.getUserIdRefreshToken(req.cookies.refreshToken)
    if(userId) {
        req.user = await usersService.getUserById(userId)
        next()
        return
    }
    res.sendStatus(401)
}

export const checkBlackList = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.cookie) {
        res.sendStatus(401)
        return
    }
    const checkResult = await usersRepositories.checkBlackList(req.headers.cookie)
    if(checkResult) {
        res.sendStatus(401)
    } else {
        next()
        return
    }
}

export const checkInvalidHeadersCookie = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.cookie) {
        next()
        return
    }
    const checkResult = await jwtService.getUserIdRefreshToken(req.headers.cookie)
    if(!checkResult) {
        res.sendStatus(401)
    } else {
        next()
        return
    }
}