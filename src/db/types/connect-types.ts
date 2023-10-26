import {ObjectId} from "mongodb";

export type connectType = {
    IP: string,
    URL: string,
    date: number,
    title: string,
    deviceId: string,
    userId: ObjectId | undefined
}