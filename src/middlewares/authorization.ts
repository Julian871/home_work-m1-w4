import {NextFunction, Request, Response} from "express";

export const authorizationMiddleware = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    if(req.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
       return res.sendStatus(401)

    } else {
       return next();
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.authorization !== 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTUxMTEwNDksImV4cCI6MTY5NTExNDY0OX0.UMUEyc9SN5z9FM0nn2DcL5K7elejKy1WFlq-S8vlp_s') {
        return res.sendStatus(401)

    } else {
        return next();
    }

    /*if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdToken(token)
    if(userId) {
        req.user = await usersService.getUserById(userId)
        next()
    }
    res.send(401)*/
}