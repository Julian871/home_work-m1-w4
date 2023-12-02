import {NextFunction, Request, Response} from "express";
import {connectService} from "../application/connect-service";
import {v4 as uuidv4} from "uuid";


export const checkConnect = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip
    const URL = req.originalUrl
    const deviceName = req.headers['user-agent'] || 'hacker'
    const deviceId = uuidv4()


    const countConnect = await connectService.countConnection(IP, URL)
    if (countConnect >= 5) {
        await connectService.createConnection(IP, URL, deviceName, deviceId)
        return res.sendStatus(429)
    } else {
        await connectService.createConnection(IP, URL, deviceName, deviceId)
        req.deviceId = deviceId
        return next()
    }
}