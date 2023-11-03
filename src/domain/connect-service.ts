import {connectRepositories} from "../repositories/connect-repositories";
import {ObjectId} from "mongodb";


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
    }
}