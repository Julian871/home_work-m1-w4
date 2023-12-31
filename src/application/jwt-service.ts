import jwt from 'jsonwebtoken'
import {JWT_SECRET, REFRESH_JWT_SECRET} from "../settings";
import {ObjectId, WithId} from "mongodb";
import {userAccountDBType} from "../db/types/user-types";


export const jwtService = {
    async createJWT(user: WithId<userAccountDBType>) {
        return jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '600s'})
    },

    async createJWTRefresh(user: WithId<userAccountDBType>, deviceId: string) {
        return jwt.sign({userId: user._id, deviceId: deviceId}, REFRESH_JWT_SECRET, {expiresIn: '20s'})
    },

    async getUserIdToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            console.log(error)
            return null
        }
    },

    async getUserIdRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, REFRESH_JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            console.log(error)
            return null
        }
    },

    async getDeviceIdRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, REFRESH_JWT_SECRET)
            return result.deviceId
        } catch (error) {
            console.log(error)
            return null
        }
    }
}