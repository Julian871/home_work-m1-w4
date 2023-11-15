import {Request, Response, Router} from "express";
import mongoose from "mongoose";


export const testingRouter = Router({})

testingRouter.delete('', async (req: Request, res: Response) => {
    await mongoose.connection.dropDatabase()
    res.sendStatus(204)
})