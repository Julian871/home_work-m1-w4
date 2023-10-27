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
        console.log(_id)
        const connectInfo = await connectCollection.find({userId: _id}).toArray()
        return connectInfo.map((p) => ({
            ip: p.IP,
            title: p.title,
            lastActiveDate: new Date(p.date).toString(),
            deviceId: p.deviceId
        }))
    },

    async disconnectByDeviceId(deviceId: string) {
        const result = await connectCollection.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    },

    async updateUserId(specialId: string, userId: ObjectId) {
        await connectCollection.updateOne({specialId: specialId}, {$set: { userId: userId}})
    }
}