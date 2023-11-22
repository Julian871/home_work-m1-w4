import {body} from "express-validator";
import {blogsRepositories} from "../../repositories/blogs-db-repositories";


export const postsValidation = [
    body('title').isString().withMessage('title is not string'),
    body('title').trim().isLength({min: 1, max: 30}).withMessage('title is too long'),
    body('shortDescription').isString().withMessage('shortDescription is not string'),
    body('shortDescription').trim().isLength({min: 1, max: 100}).withMessage('shortDescription is too long'),
    body('content').isString().withMessage('content is not string'),
    body('content').trim().isLength({min: 1, max: 1000}).withMessage('content is too long'),
    body('blogId').isString().withMessage('blogId is not string'),
    body('blogId')
        .custom(async (value) => {
            const blog = await blogsRepositories.getBlogById(value)
            if (!blog) {
                throw new Error('incorrect blogID')
            }
        }).custom(async (value) => {
        const blog = await blogsRepositories.getBlogById(value)
        if (!blog) {
            throw new Error('incorrect blogID')
        }
    })
        .withMessage('incorrect blogID')
]