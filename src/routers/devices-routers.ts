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

    .delete('/:id',
        authCookie,
        async (req:Request, res: Response) => {
        const checkUser = await connectService.checkUser(req.cookies.refreshToken, req.params.id)
            if(!checkUser) {
                res.sendStatus(403)
                return
            }
        const disconnect = await connectService.disconnectByDeviceId(req.params.id)
            if(disconnect) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
    })