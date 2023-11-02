import {NextFunction, Request, Response} from "express";
import {connectService} from "../domain/connect-service";


export const checkConnect = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip
    const URL = req.originalUrl
    const deviceName = req.headers['user-agent'] || 'hacker'

    await connectService.createConnection(IP, URL, deviceName)

    const countConnect = await connectService.countConnection(IP, URL )
    if(countConnect > 5) {
        return res.sendStatus(429)
    } else {
        return next()
    }
}