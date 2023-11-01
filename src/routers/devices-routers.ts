import {Request, Response, Router} from "express";
import {connectService} from "../domain/connect-service";
import {authCookie} from "../middlewares/authorization";
import {jwtService} from "../application/jwt-service";
import {ObjectId} from "mongodb";

export const deviceRouter = Router({})

deviceRouter
    .get('/',
        authCookie,
        async (req: Request, res: Response) => {
        const userId = await jwtService.getUserIdRefreshToken(req.cookies.refreshToken)
            if(!userId) {
                res.sendStatus(404)
            } else {
                const getConnectionInfo = await connectService.getConnectInfo(userId)
                if (getConnectionInfo) {
                    res.status(200).send(getConnectionInfo)
                } else {
                    res.sendStatus(404)
                }
            }
    })

    .delete('/:id',
        authCookie,
        async (req:Request, res: Response) => {
        const checkUser = await connectService.checkID(req.cookies.refreshToken, req.params.id)
            if(checkUser === null) {
                res.sendStatus(404)
                return
            }

            if(!checkUser) {
                res.sendStatus(403)
                return
            }

        const disconnect = await connectService.disconnectByDeviceId(req.params.id)
            if(disconnect) {
                res.sendStatus(204)
            }
    })

    .delete('/',
        authCookie,
        async (req:Request, res: Response) => {
            const deviceId = jwtService.getDeviceIdRefreshToken(req.cookies.refreshToken)
            if(!req.user?.id){
                res.sendStatus(401)
                return
            } else {
                const userId = new ObjectId(req.user.id)
                await connectService.deleteSession(userId)
                return res.sendStatus(204)
            }
        })