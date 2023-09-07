import {Request, Response, Router} from "express";
import {blogsReposetories} from "../repositories/blogs-db-reposetories";
import {blogsValidation} from "../middlewares/blogs/blogs-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization";
import {blogTypeOutput} from "../db/types/blog-types";
import {ObjectId} from "mongodb";
import {RequestQueryParams} from "./query-types";

export const blogsRouter = Router({})

blogsRouter.get('/',async (req: RequestQueryParams<{searchNameTerm: string | null, sortBy: string, sortDirection: string, pageNumber: number, pageSize: number}>, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm || null
    const sortBy = req.query.sortBy || 'createdAt'
    const sortDirection = req.query.sortDirection || 'desc'
    const pageNumber = req.query.pageNumber || 1
    const pageSize = req.query.pageSize || 10

    const foundBlogs: blogTypeOutput[] = await blogsReposetories.getAllBlogs()

    foundBlogs.sort(function (a, b) {
        if (a.createdAt < b.createdAt) {
            return 1;
        }
        if (a.createdAt > b.createdAt) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    });

    const blogList = {
        pagesCount: Math.ceil(foundBlogs.length / 10),
        page: pageNumber,
        pageSize,
        totalCount: foundBlogs.length,
        items: foundBlogs.slice(0, 9)
    }
    res.send(blogList)
})
blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const isValid = ObjectId.isValid(req.params.id)

    if(!isValid){
        res.sendStatus(404)
        return
    }

    let blog = await blogsReposetories.getBlogById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.post('/',
    authorizationMiddleware,
    blogsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newBlogs = await blogsReposetories.createNewBlog(req.body)
        res.status(201).send(newBlogs)
    })

blogsRouter.put('/:id',
    authorizationMiddleware,
    blogsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isUpdate = await blogsReposetories.updateBlogById(req.params.id, req.body)
        if (isUpdate) {
            const blog = await blogsReposetories.getBlogById(req.params.id)
            res.status(204).send(blog)
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.delete('/:id', authorizationMiddleware, async (req: Request, res: Response) => {
    const isDelete = await blogsReposetories.deleteBlogById(req.params.id)
    if (isDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})