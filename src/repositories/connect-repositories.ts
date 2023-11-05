import {connectCollection} from "../db/db";
import {connectType} from "../db/types/sessions-type";
import {ObjectId} from "mongodb";


export const connectRepositories = {

    async countConnection(IP: string, URL: string) {
        const limitDate = +new Date - 10000
        return await connectCollection.countDocuments({IP: IP, URL: URL, lastActiveDate: { $gt: limitDate}})
    },

    async createConnectionInfo(connectInformation: connectType) {
        await connectCollection.insertOne(connectInformation)
    },

    async getDeviceList(_id: ObjectId) {
        const connectInfo = await connectCollection.find({userId: _id}).toArray()
        console.log('connectInfo', connectInfo)
        return connectInfo.map((p) => ({
            ip: p.IP,
            title: p.deviceName,
            lastActiveDate: new Date(p.lastActiveDate),
            deviceId: p.deviceId
        }))
    },

    async updateUserId(userId: ObjectId, deviceId: string) {
        await connectCollection.updateMany({deviceId: deviceId}, {$set: {userId: userId}})
    },

    async updateConnectDate(deviceId: string) {
        await connectCollection.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: +new Date}})
    },

    async findDeviceId(deviceId: string) {
        return await connectCollection.findOne({deviceId: deviceId})
    },

    async deleteByDeviceId(deviceId: string) {
        await connectCollection.deleteMany({deviceId: deviceId})
    },

    async deleteUserSession(userId: ObjectId | null, deviceId: string) {
        await connectCollection.deleteMany({userId: userId, deviceId: {$not: {$regex: deviceId}} })
    },
}