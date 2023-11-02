import {NextFunction, Request, Response} from "express";
import {connectService} from "../domain/connect-service";
import {connectRepositories} from "../repositories/connect-repositories";


export const checkConnect = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip
    const URL = req.originalUrl
    const deviceName = req.headers['user-agent'] || 'hacker'

    const countConnect = await connectRepositories.countConnection(IP, URL)
    console.log('count: ', countConnect)
    if(countConnect >= 5) {
        await connectService.createConnection(IP, URL, deviceName)
        return res.sendStatus(429)
    } else {
        await connectService.createConnection(IP, URL, deviceName)
        return next()
    }
}