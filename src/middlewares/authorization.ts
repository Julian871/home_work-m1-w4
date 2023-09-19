import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

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
        req.body = await usersService.getUserById(userId)
        next()
    }
    res.send(401)
}