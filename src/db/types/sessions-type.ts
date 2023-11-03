import {ObjectId} from "mongodb";


export type connectType = {
    IP: string,
    URL: string,
    lastActiveDate: number,
    deviceName: string,
    deviceId: string,
    userId: null | ObjectId
}

export type connectOutput = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}