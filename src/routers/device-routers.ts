import {Router} from "express";
import {authCookie} from "../middlewares/authorization";
import {container} from "../composition-root";
import {DeviceController} from "../controllers/device-controller";


const deviceController = container.resolve(DeviceController)

export const deviceRouter = Router({})

deviceRouter
    .get('/', authCookie, deviceController.getDevice.bind(deviceController))
    .delete('/:id', authCookie, deviceController.deleteDevice.bind(deviceController))
    .delete('/', authCookie, deviceController.deleteAllDevice.bind(deviceController))