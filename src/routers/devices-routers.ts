import {Request, Response, Router} from "express";
import {connectService} from "../domain/connect-service";
import {authCookie} from "../middlewares/authorization";
import {jwtService} from "../application/jwt-service";

export const deviceRouter = Router({})

deviceRouter
    .get('/',
        authCookie,
        async (req: Request, res: Response) => {
            const userId = await jwtService.getUserIdRefreshToken(req.cookies.refreshToken)
            if(!userId) {
                res.status(404).send('no userId')
                return
            }

            const getConnectionInfo = await connectService.getConnectInfo(userId)

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
