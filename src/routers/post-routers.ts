import {Request, Response, Router} from "express";
import {postsValidation} from "../middlewares/posts/posts-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware, authorizationMiddleware} from "../middlewares/authorization";
import {RequestParams, RequestQueryParams} from "../db/types/query-types";
import {getPaginationData} from "../utils/pagination.utility";
import {getSortPostsQuery} from "../utils/posts-query.utility";
import {postsService} from "../domain/posts-service";
import {authLikeStatus, checkValidParams} from "../middlewares/auth";
import {checkHeadersBeforeLike} from "../utils/getLikeStatus.utility";
import {commentValidation} from "../middlewares/posts/comment-validation";
import {ObjectId} from "mongodb";


export const postsRouter = Router({})

postsRouter
    .get('/', async (req: RequestQueryParams<{
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    }>, res: Response) => {

        const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        const postList = await postsService.getAllPosts({
            ...postsQuery,
            ...pagination
        }, userId)

        res.send(postList)
    })

    .get('/:id',
        checkValidParams,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const userId = await checkHeadersBeforeLike(req.headers.authorization!)

            let post = await postsService.getPostById(req.params.id, userId)
            if (post) {
                res.status(200).send(post)
            } else {
                res.sendStatus(404)
            }
        })


    .post('/',
        authorizationMiddleware,
        postsValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const newPosts = await postsService.createNewPost(req.body)
            res.status(201).send(newPosts)
        })


    .put('/:id',
        checkValidParams,
        authorizationMiddleware,
        postsValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const userId = await checkHeadersBeforeLike(req.headers.authorization!)

            const isUpdate = await postsService.updatePostById(req.params.id, req.body)
            if (isUpdate) {
                const post = await postsService.getPostById(req.params.id, userId)
                res.status(204).send(post)
            } else {
                res.sendStatus(404)
            }
        })

    .put('/:id/like-status',
        authLikeStatus,
        authMiddleware,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const userId = await checkHeadersBeforeLike(req.headers.authorization!)

            const checkId = await postsService.getPostById(req.params.id, userId)
            if (!checkId) return res.sendStatus(404)
            if (!req.user) return res.status(404).send('no user')

            await postsService.updateLikeStatus(req.params.id, req.body.likeStatus, req.user.id, req.user.login)
            return res.sendStatus(204)
        })

    .delete('/:id',
        checkValidParams,
        inputValidationMiddleware,
        authorizationMiddleware,
        async (req: Request, res: Response) => {
            const isDelete = await postsService.deletePostById(req.params.id)
            if (isDelete) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        })

postsRouter.get('/:id/comments', async (req: RequestParams<{ id: string }, {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}>, res: Response) => {

    const checkPostsComments = await postsService.checkPostCommentCollection(req.params.id)
    const userId = await checkHeadersBeforeLike(req.headers.authorization!)

    if (checkPostsComments) {
        const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

        const postCommentsList = await postsService.getAllPostsComments({
            ...postsQuery,
            ...pagination
        }, req.params.id, userId);

        res.send(postCommentsList)
    } else {
        res.sendStatus(404)
        return
    }
})

postsRouter.post('/:id/comments',
    authMiddleware,
    commentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(404)
            return
        }

        const checkID = await postsService.checkPostCollection(req.params.id)

        if (checkID) {
            const newPostComment = await postsService.createNewPostComment(req.params.id, req.body, req.user!)
            res.status(201).send(newPostComment)
        } else {
            res.sendStatus(404)
        }
    })