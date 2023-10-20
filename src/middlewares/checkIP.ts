import {NextFunction, Request, Response} from "express";
import {connectService} from "../domain/connect-service";

export const checkIP = async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    const IP = req.ip
    const URL = req.baseUrl
    const checkIpConnection = await connectService.checkIP(IP, URL)
    console.log('checkIpConnection: ', checkIpConnection)
    if (checkIpConnection) {
        return next()
    } else {
        return res.sendStatus(429)
    }
}