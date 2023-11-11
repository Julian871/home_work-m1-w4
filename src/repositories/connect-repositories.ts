import {ConnectModel} from "../db/db";
import {connectType} from "../db/types/sessions-type";
import {ObjectId} from "mongodb";


export const connectRepositories = {

    async countConnection(IP: string, URL: string) {
        const limitDate = +new Date - 10000
        return ConnectModel.countDocuments({IP: IP, URL: URL, lastActiveDate: {$gt: limitDate}});
    },

    async createConnectionInfo(connectInformation: connectType) {
        await ConnectModel.insertMany(connectInformation)
    },

    async getDeviceList(_id: ObjectId) {
        const connectInfo = await ConnectModel.find({userId: _id}).lean()
        console.log('connectInfo', connectInfo)
        return connectInfo.map((p) => ({
            ip: p.IP,
            title: p.deviceName,
            lastActiveDate: new Date(p.lastActiveDate),
            deviceId: p.deviceId
        }))
    },

    async updateUserId(userId: ObjectId, deviceId: string) {
        await ConnectModel.updateMany({deviceId: deviceId}, {$set: {userId: userId}})
    },

    async updateConnectDate(deviceId: string) {
        await ConnectModel.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: +new Date}})
    },

    async findDeviceId(deviceId: string) {
        return ConnectModel.findOne({deviceId: deviceId});
    },

    async deleteByDeviceId(deviceId: string) {
        await ConnectModel.deleteMany({deviceId: deviceId})
    },

    async deleteUserSession(userId: ObjectId | null, deviceId: string) {
        await ConnectModel.deleteMany({userId: userId, deviceId: {$not: {$regex: deviceId}} })
    },
}