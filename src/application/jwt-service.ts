import jwt from 'jsonwebtoken'
import {JWT_SECRET} from "../settings";
import {ObjectId, WithId} from "mongodb";
import {userTypeInput} from "../db/types/user-types";


export const jwtService = {
    async createJWT(user: WithId<userTypeInput>) {
        return jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '1h'})
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