import {NextFunction, Request, Response} from "express";

export const authorizationMiddleware = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    if(req.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
       return res.sendStatus(401)
    } else {
       return next();
    }
}