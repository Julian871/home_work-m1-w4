import express from "express";
import {blogsRouter} from "./routers/blogs-routers";
import {postsRouter} from "./routers/post-routers";
import bodyParser from "body-parser";
import {testingRouter} from "./routers/delete-all";

export const app = express()

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)


app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing/all-data', testingRouter)