import express from "express";
import {blogsRouter} from "./routers/blogs-routers";
import {postsRouter} from "./routers/post-routers";
import {usersRouter} from "./routers/users-routers";
import {testingRouter} from "./routers/delete-all-routers";
import {authRouter} from "./routers/auth-routers";
import {comRouter} from "./routers/comments-routers";
import cookieParser from 'cookie-parser'
import bodyParser from "body-parser";





export const app = express()

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)
app.use(cookieParser())


app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing/all-data', testingRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', comRouter)

export const JWT_SECRET = process.env.JWT_SECRET || '123'