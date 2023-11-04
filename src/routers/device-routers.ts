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
                const deviceList = await connectService.getDeviceList(userId)
                res.status(200).send(deviceList)
            }
    })

    .delete('/:id',
        authCookie,
        async (req: Request, res: Response) => {
            const checkResult = await connectService.checkDeviceId(req.params.id, req.cookies.refreshToken)
            console.log('checkResult: ', checkResult)

            if(checkResult === null) {
                return res.sendStatus(404)
            }

            if(!checkResult) {
                return res.sendStatus(403)
            } else {
                await usersRepositories.updateBlackList(req.cookies.refreshToken)
                return res.sendStatus(204)
            }
    })

    .delete('/',
        authCookie,
        async (req: Request, res: Response) => {
        await usersRepositories.updateBlackList(req.cookies.refreshToken)
        await connectService.deleteUserSession(req.cookies.refreshToken)
            res.sendStatus(204)
        })