import {connectCollection} from "../db/db";
import {connectType} from "../db/types/sessions-type";


export const connectRepositories = {

    async countConnection(IP: string, URL: string) {
        const limitDate = +new Date - 10000
        return await connectCollection.countDocuments({IP: IP, URL: URL, date: { $gt: limitDate}})
    },

    async createConnectionInfo(connectInformation: connectType) {
        await connectCollection.insertOne(connectInformation)
    }
}