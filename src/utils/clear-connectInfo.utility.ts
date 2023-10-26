import {NextFunction, Response} from "express";
import {connectCollection} from "../db/db";


export const clearConnectDb = async (req: Request, res: Response, next: NextFunction) => {
    const timeCondition = +new Date - 20000
    await connectCollection.deleteMany({date: { $lt: timeCondition}})
    next()
    return
}