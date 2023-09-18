import {Request, Response, Router} from "express";
import {postsValidation} from "../middlewares/posts/posts-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization";
import {RequestParams, RequestQueryParams} from "../db/types/query-types";
import {getPaginationData} from "../utils/pagination.utility";
import {getSortPostsQuery} from "../utils/posts-query.utility";
import {postsService} from "../domain/posts-service";
import {ObjectId} from "mongodb";
import {commentValidation} from "../middlewares/posts/comment-validation";



export const postsRouter = Router({})

postsRouter.get('/', async (req: RequestQueryParams<{sortBy: string, sortDirection: string, pageNumber: number, pageSize: number}>, res: Response) => {

    const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
    const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

    const postList = await postsService.getAllPosts({
        ...postsQuery,
        ...pagination
    })

    res.send(postList)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }
    let post = await postsService.getPostById(req.params.id)
    if (post) {
        res.status(200).send(post)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.get('/:id/comments', async (req: RequestParams<{id: string},{sortBy: string, sortDirection: string, pageNumber: number, pageSize: number}>, res: Response) => {

    const checkPostsComments = await postsService.checkPostCommentCollection(req.params.id)

    if(checkPostsComments) {
        const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

        const postCommentsList = await postsService.getAllPostsComments({
            ...postsQuery,
            ...pagination
        });

        res.send(postCommentsList)
    } else {
        res.sendStatus(404)
        return
    }


    const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
    const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

    const postList = await postsService.getAllPostsComments({
        ...postsQuery,
        ...pagination
    });

    res.send(postList)
})

postsRouter.post('/',
    authorizationMiddleware,
    postsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newPosts = await postsService.createNewPost(req.body)
        res.status(201).send(newPosts)
    })

postsRouter.post('/:id/comments',
    authorizationMiddleware,
    commentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        if(!ObjectId.isValid(req.params.id)){
            res.sendStatus(404)
            return
        }

        const checkID = await postsService.checkPostCollection(req.params.id)

        if(checkID) {
            const newPostComment = await postsService.createNewPostComment(req.params.id, req.body)
            res.status(201).send(newPostComment)
        } else {
            res.sendStatus(404)
        }
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
        const isUpdate = await postsService.updatePostById(req.params.id, req.body)
        if (isUpdate) {
            const post = await postsService.getPostById(req.params.id)
            res.status(204).send(post)
        } else {
            res.sendStatus(404)
        }
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