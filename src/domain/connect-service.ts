import {connectRepositories} from "../repositories/connect-repositories";
import {v4 as uuidv4} from "uuid";


export const connectService = {

    async countConnection(IP: string, URL: string) {
        return await connectRepositories.countConnection(IP, URL)
    },

    async createConnection(IP: string, URL: string, deviceName: string) {
        const connectInformation = {
            IP: IP,
            URL: URL,
            lastActiveDate: +new Date,
            deviceName: deviceName,
            deviceId: uuidv4()
        }

        await connectRepositories.createConnectionInfo(connectInformation)
    }
}