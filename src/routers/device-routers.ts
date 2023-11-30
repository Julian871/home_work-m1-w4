import {Request, Response, Router} from "express";
import {ConnectService} from "../domain/connect-service";
import {jwtService} from "../application/jwt-service";
import {authCookie} from "../middlewares/authorization";
import {deviceController} from "../composition-root";


export const deviceRouter = Router({})

export class DeviceController {
    constructor(protected connectService: ConnectService) {}

    async getDevice(req: Request, res: Response) {
        const userId = await jwtService.getUserIdRefreshToken(req.cookies.refreshToken)
        if (!userId) {
            res.sendStatus(401)
        } else {
            const deviceList = await this.connectService.getDeviceList(userId)
            res.status(200).send(deviceList)
        }
    }

    async deleteDevice(req: Request, res: Response) {
        const checkResult = await this.connectService.checkDeviceId(req.params.id, req.cookies.refreshToken)

        if (checkResult === null) {
            return res.sendStatus(404)
        }

        if (!checkResult) {
            return res.sendStatus(403)
        } else {
            return res.sendStatus(204)
        }
    }

    async deleteAllDevice(req: Request, res: Response) {
        await this.connectService.deleteUserSession(req.cookies.refreshToken)
        res.sendStatus(204)
    }
}

deviceRouter
    .get('/', authCookie, deviceController.getDevice.bind(deviceController))
    .delete('/:id', authCookie, deviceController.deleteDevice.bind(deviceController))
    .delete('/', authCookie, deviceController.deleteAllDevice.bind(deviceController))