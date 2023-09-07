import {Request, Response, Router} from "express";
import {db} from "../db/db";

export const testingRouter = Router({})

testingRouter.delete('', async (req: Request, res: Response) => {
    await db.dropDatabase()
    res.sendStatus(204)
})