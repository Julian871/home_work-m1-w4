import {NextFunction, Request, Response} from "express";
import {blackListCollection} from "../db/db";


export const checkBlackList = async (req: Request, res: Response, next: NextFunction) => {
    const checkBL = await blackListCollection.countDocuments({refreshToken: req.cookies.refreshToken})

    if(checkBL >= 1) {
        return res.sendStatus(401)
    } else {
        return next()
    }
}