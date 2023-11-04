import {connectRepositories} from "../repositories/connect-repositories";
import {ObjectId} from "mongodb";
import {jwtService} from "../application/jwt-service";


export const connectService = {

    async createConnection(IP: string, URL: string, deviceName: string, deviceId: string) {
        const connectInformation = {
            IP: IP,
            URL: URL,
            lastActiveDate: +new Date,
            deviceName: deviceName,
            deviceId: deviceId,
            userId: null
        }
        await connectRepositories.createConnectionInfo(connectInformation)
    },

    async getDeviceList(userId: ObjectId) {
        return await connectRepositories.getDeviceList(userId)
    },

    async checkDeviceId(deviceId: string, token: string) {
        const findDeviceId = await connectRepositories.findDeviceId(deviceId)
        if(!findDeviceId) {
            return null
        }

        const tokenDeviceId = await jwtService.getDeviceIdRefreshToken(token)

        if(findDeviceId.deviceId === tokenDeviceId) {
            await connectRepositories.deleteByDeviceId(deviceId)
            return true
        } else {
            return false
        }
    },

    async deleteUserSession(token: string) {
        const userId = await jwtService.getUserIdRefreshToken(token)
        const deviceId = await jwtService.getDeviceIdRefreshToken(token)
        await connectRepositories.deleteUserSession(userId, deviceId)
    },
}