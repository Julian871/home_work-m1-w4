import {connectRepositories} from "../repositories/connect-repositories";
import {connectType} from "../db/types/connect-types";


export const connectService = {
    async checkIP(ip: string, url: string){
        const connectionInformation = {
            IP: ip,
            URL: url,
            date: +new Date()
        }
        await connectRepositories.createConnectInfo(connectionInformation)

        const countLimitConnection = await connectRepositories.countLimitConnection(ip, url)

        return countLimitConnection <= 5;
    }
}