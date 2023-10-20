import {connectRepositories} from "../repositories/connect-repositories";
import {connectType} from "../db/types/connect-types";


export const connectService = {
    async checkIP(ip: string, url: string, deviceName: string){
        const connectionInformation = {
            IP: ip,
            URL: url,
            date: +new Date(),
            title: deviceName,
            deviceId: 'any'
        }
        await connectRepositories.createConnectInfo(connectionInformation)

        const countLimitConnection = await connectRepositories.countLimitConnection(ip, url)

        return countLimitConnection <= 5;
    },

    async getConnectInfo(ip: string, deviceName: string) {
        const connectInfo = await connectRepositories.getConnectInfo(ip, deviceName)
        if(connectInfo) {
            return {
                ip: ip,
                title: deviceName,
                lastActiveDate: connectInfo.date,
                deviceId: connectInfo.deviceId
            }
        } else {
            return null
        }
    }
}