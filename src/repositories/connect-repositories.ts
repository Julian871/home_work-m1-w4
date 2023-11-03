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

    async updateConnectDate(IP: string, URL: string, userId: ObjectId, deviceId: string) {
        await connectCollection.updateOne({IP: IP, URL: URL, deviceId: deviceId, userId: userId}, {$set: {lastActiveDate: +new Date}})
    },
}