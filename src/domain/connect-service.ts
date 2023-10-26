import {connectRepositories} from "../repositories/connect-repositories";
import {v4 as uuidv4} from "uuid";
import {jwtService} from "../application/jwt-service";
import {ObjectId} from "mongodb";


export const connectService = {
    async checkIP(ip: string, url: string, deviceName: string, userId: ObjectId | undefined){
        const connectionInformation = {
            IP: ip,
            URL: url,
            date: +new Date(),
            title: deviceName,
            deviceId: uuidv4(),
            userId: userId
        }
        await connectRepositories.createConnectInfo(connectionInformation)

        const countLimitConnection = await connectRepositories.countLimitConnection(ip, url)

        if(countLimitConnection <= 5 ) {
            return connectionInformation
        } else {
            return false
        }
    },

    async getConnectInfo(_id: ObjectId) {
        return await connectRepositories.getConnectInfo(_id)

    },

    async disconnectByDeviceId(deviceId: string) {
        return await connectRepositories.disconnectByDeviceId(deviceId)
    },

    async checkUser(token: string, deviceId: string) {
        const deviceIdFromCookieToken = await jwtService.getDeviceIdRefreshToken(token)
        return deviceIdFromCookieToken === deviceId
    }
}