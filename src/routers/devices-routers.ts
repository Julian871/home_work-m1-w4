import {Request, Response, Router} from "express";
import {connectService} from "../domain/connect-service";
import {authCookie} from "../middlewares/authorization";

export const deviceRouter = Router({})

deviceRouter
    .get('/',
        authCookie,
        async (req: Request, res: Response) => {
        const IP = req.ip
        const deviceName = req.headers['user-agent'] || 'hacker'
        const getConnectionInfo = await connectService.getConnectInfo(IP, deviceName)

        if(getConnectionInfo) {
            res.status(200).send(getConnectionInfo)
        } else {res.sendStatus(404)}
    })