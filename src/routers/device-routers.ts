import {Request, Response, Router} from "express";
import {connectService} from "../domain/connect-service";
import {jwtService} from "../application/jwt-service";
import {authCookie} from "../middlewares/authorization";
import {usersRepositories} from "../repositories/users-db-repositories";


export const deviceRouter = Router({})

deviceRouter
    .get('/',
        authCookie,
        async (req: Request, res: Response) => {
        const userId = await jwtService.getUserIdRefreshToken(req.cookies.refreshToken)
            if(!userId) {
                res.sendStatus(401)
            } else {
                await usersRepositories.updateBlackList(req.cookies.refreshToken)
                const deviceList = await connectService.getDeviceList(userId)
                res.status(200).send(deviceList)
            }
    })