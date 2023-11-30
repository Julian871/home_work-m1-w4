import {ObjectId} from "mongodb";
import {jwtService} from "../application/jwt-service";
import {ConnectRepository} from "../repositories/connect-repository";


export class ConnectService {
    connectRepositories: ConnectRepository
    constructor() {
        this.connectRepositories = new ConnectRepository()
    }

    async createConnection(IP: string, URL: string, deviceName: string, deviceId: string) {
        const connectInformation = {
            IP: IP,
            URL: URL,
            lastActiveDate: +new Date,
            deviceName: deviceName,
            deviceId: deviceId,
            userId: null
        }
        await this.connectRepositories.createConnectionInfo(connectInformation)
    }

    async getDeviceList(userId: ObjectId) {
        const connectInfo = await this.connectRepositories.getDeviceList(userId)
        return connectInfo.map((p) => ({
            ip: p.IP,
            title: p.deviceName,
            lastActiveDate: new Date(p.lastActiveDate),
            deviceId: p.deviceId
        }))
    }

    async checkDeviceId(deviceId: string, token: string) {
        const findDeviceId = await this.connectRepositories.findDeviceId(deviceId)
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
            await this.connectRepositories.deleteByDeviceId(deviceId)
            return true
        } else {
            return false
        }
    }

    async findDeviceId(deviceId: any) {
        return await this.connectRepositories.findDeviceId(deviceId)
    }

    async deleteUserSession(token: string) {
        const userId = await jwtService.getUserIdRefreshToken(token)
        const deviceId = await jwtService.getDeviceIdRefreshToken(token)
        await this.connectRepositories.deleteUserSession(userId, deviceId)
    }

    async deleteByDeviceId(deviceId: any) {
        await this.connectRepositories.deleteByDeviceId(deviceId)
    }

    async updateConnectDate(deviceId: any) {
        await this.connectRepositories.updateConnectDate(deviceId)
    }

    async countConnection(IP: string, URL: string) {
        return await this.connectRepositories.countConnection(IP, URL)
    }
}

export const connectService = new ConnectService()