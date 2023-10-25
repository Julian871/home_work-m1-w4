import {NextFunction, Request, Response} from "express";
import {connectService} from "../domain/connect-service";

export const checkIP = async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    const IP = req.ip
    const URL = req.originalUrl
    const deviceName = req.headers['user-agent'] || 'hacker'
    const checkIpConnection = await connectService.checkIP(IP, URL, deviceName)
    if (checkIpConnection) {
        return next()
    } else {
        return res.sendStatus(429)
    }
}
