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
        const connectInfo = await connectRepositories.getDeviceList(userId)
        return connectInfo.map((p) => ({
            ip: p.IP,
            title: p.deviceName,
            lastActiveDate: new Date(p.lastActiveDate),
            deviceId: p.deviceId
        }))
    },

    async checkDeviceId(deviceId: string, token: string) {
        const findDeviceId = await connectRepositories.findDeviceId(deviceId)
        if (!findDeviceId) {
            return null
        }

        const tokenUserId = await jwtService.getUserIdRefreshToken(token)
        let userId;
        let tokenUser;

        if (findDeviceId.userId && tokenUserId) {
            userId = findDeviceId.userId.toString()
            tokenUser = tokenUserId.toString()
        }

        if (userId === tokenUser) {
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