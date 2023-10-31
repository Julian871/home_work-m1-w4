import {connectCollection} from "../db/db";
import {connectType} from "../db/types/connect-types";
import {ObjectId} from "mongodb";


export const connectRepositories = {
    async createConnectInfo(newConnect: connectType){
        await connectCollection.insertOne(newConnect)
    },

    async countLimitConnection(ip: string, url: string) {
        const limitDate = +new Date - 10000
        return await connectCollection.countDocuments({IP: ip, URL: url, date: { $gt: limitDate}   })
    },

    async getConnectInfo(_id: ObjectId) {
        const connectInfo = await connectCollection.find({userId: _id}).toArray()
        return connectInfo.map((p) => ({
            ip: p.IP,
            title: p.title,
            lastActiveDate: new Date(p.date),
            deviceId: p.deviceId
        }))
    },

    async disconnectByDeviceId(deviceId: string) {
        console.log(deviceId)
        const result = await connectCollection.deleteMany({deviceId: deviceId})
        return result.deletedCount > 0
    },

    async updateUserId(specialId: string, userId: ObjectId) {
        await connectCollection.updateOne({specialId: specialId}, {$set: { userId: userId}})
    },

    async deleteSession(userId: ObjectId, deviceName: string) {
        await connectCollection.deleteMany({userId: userId, title: {$not: { $regex: deviceName}}})
        await connectCollection.deleteMany({userId: null})
    },

    async findID(deviceId: string) {
        return await connectCollection.findOne({deviceId: deviceId})
    },

    async updateDeviceId(deviceId: string, specialId: string) {
        await connectCollection.updateOne({specialId: specialId}, {$set: {deviceId: deviceId}})
    },
}