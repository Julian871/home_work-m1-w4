import {ConnectService} from "../application/connect-service";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {injectable} from "inversify";


@injectable()
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