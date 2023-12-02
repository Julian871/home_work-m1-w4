import {Router} from "express";
import {authCookie} from "../middlewares/authorization";
import {deviceController} from "../composition-root";


export const deviceRouter = Router({})

deviceRouter
    .get('/', authCookie, deviceController.getDevice.bind(deviceController))
    .delete('/:id', authCookie, deviceController.deleteDevice.bind(deviceController))
    .delete('/', authCookie, deviceController.deleteAllDevice.bind(deviceController))