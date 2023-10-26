import {connectRepositories} from "../repositories/connect-repositories";
import {v4 as uuidv4} from "uuid";
import {jwtService} from "../application/jwt-service";
import {ObjectId} from "mongodb";
import {usersRepositories} from "../repositories/users-db-repositories";


export const connectService = {
    async checkIP(ip: string, url: string, deviceName: string){
        const connectionInformation = {
            specialId: uuidv4(),
            IP: ip,
            URL: url,
            date: +new Date(),
            title: deviceName,
            deviceId: uuidv4(),
            userId: null
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
    },

    async updateUserId(specialId: string, login: string) {
        const user = await usersRepositories.getUserByLogin(login)
        if(!user) {
            return false
        } else {
            await connectRepositories.updateUserId(specialId, user._id)
            return true
        }
    }
}