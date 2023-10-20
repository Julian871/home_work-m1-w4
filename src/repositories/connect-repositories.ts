import {connectCollection} from "../db/db";
import {connectType} from "../db/types/connect-types";


export const connectRepositories = {
    async createConnectInfo(newConnect: connectType){
        await connectCollection.insertOne(newConnect)
    },

    async countLimitConnection(ip: string, url: string) {
        const limitDate = +new Date - 15000
        return await connectCollection.countDocuments({$and: [ {IP: ip}, {URL: url }, {date: { $gt: limitDate} } ] }, {limit: 6})
    }
}