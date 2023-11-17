import {Request, Response, Router} from "express";
import {postsValidation} from "../middlewares/posts/posts-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware, authorizationMiddleware} from "../middlewares/authorization";
import {RequestQueryParams} from "../db/types/query-types";
import {getPaginationData} from "../utils/pagination.utility";
import {getSortPostsQuery} from "../utils/posts-query.utility";
import {postsService} from "../domain/posts-service";
import {ObjectId} from "mongodb";
import {authLikeStatus} from "../middlewares/auth";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {jwtService} from "../application/jwt-service";



export const postsRouter = Router({})

postsRouter.get('/', async (req: RequestQueryParams<{sortBy: string, sortDirection: string, pageNumber: number, pageSize: number}>, res: Response) => {

    const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
    const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);
    let userId: string
    if(!req.headers.authorization) {
        userId = '0'
    } else {
        const getUserId = await jwtService.getUserIdToken(req.headers.authorization.split(' ')[1])
        if(!getUserId) {
            userId = '0'
        } else {
            userId = getUserId.toString()
        }
    }

    const postList = await postsService.getAllPosts({
        ...postsQuery,
        ...pagination
    }, userId)

    res.send(postList)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }
    let userId: string
    if(!req.headers.authorization) {
        userId = '0'
    } else {
        const getUserId = await jwtService.getUserIdToken(req.headers.authorization.split(' ')[1])
        if(!getUserId) {
            userId = '0'
        } else {
            userId = getUserId.toString()
        }
    }
    let post = await postsService.getPostById(req.params.id, userId)
    if (post) {
        res.status(200).send(post)
    } else {
        res.sendStatus(404)
    }
})



postsRouter.post('/',
    authorizationMiddleware,
    postsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newPosts = await postsService.createNewPost(req.body)
        res.status(201).send(newPosts)
    })


postsRouter.put('/:id',
    authorizationMiddleware,
    postsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        if(!ObjectId.isValid(req.params.id)){
            res.sendStatus(404)
            return
        }
        let userId: string
        if(!req.headers.authorization) {
            userId = '0'
        } else {
            const getUserId = await jwtService.getUserIdToken(req.headers.authorization.split(' ')[1])
            if(!getUserId) {
                userId = '0'
            } else {
                userId = getUserId.toString()
            }
        }
        const isUpdate = await postsService.updatePostById(req.params.id, req.body)
        if (isUpdate) {
            const post = await postsService.getPostById(req.params.id, userId)
            res.status(204).send(post)
        } else {
            res.sendStatus(404)
        }
})

postsRouter.put('/:id/like-status',
    authLikeStatus,
    authMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        let userId: string
        if(!req.headers.authorization) {
            userId = '0'
        } else {
            const getUserId = await jwtService.getUserIdToken(req.headers.authorization.split(' ')[1])
            if(!getUserId) {
                userId = '0'
            } else {
                userId = getUserId.toString()
            }
        }
        const checkId = await postsRepositories.getPostById(req.params.id, userId)
        if(!checkId) return res.sendStatus(404)
        if(!req.user) return res.status(404).send('no user')

        await postsService.updateLikeStatus(req.params.id, req.body.likeStatus, req.user.id, req.user.login)
        return res.sendStatus(204)
    })

postsRouter.delete('/:id', authorizationMiddleware, async (req: Request, res: Response) => {
    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }
    const isDelete = await postsService.deletePostById(req.params.id)
    if (isDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})