import jwt from 'jsonwebtoken'
import {JWT_SECRET, REFRESH_JWT_SECRET} from "../settings";
import {ObjectId, WithId} from "mongodb";
import {userAccountDBType} from "../db/types/user-types";


export const jwtService = {
    async createJWT(user: WithId<userAccountDBType>) {
        return jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '10'})
    },

    async createJWTRefresh(user: WithId<userAccountDBType>) {
        return jwt.sign({userId: user._id}, REFRESH_JWT_SECRET, {expiresIn: '20'})
    },

    async getUserIdToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}