import {Request, Response, Router} from "express";
import {authMiddleware} from "../middlewares/authorization";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {ObjectId} from "mongodb";
import {commentValidation} from "../middlewares/posts/comment-validation";
import {commentsService} from "../domain/comments-service";
import {postsService} from "../domain/posts-service";
import {postsRouter} from "./post-routers";
import {RequestParams} from "../db/types/query-types";
import {getSortPostsQuery} from "../utils/posts-query.utility";
import {getPaginationData} from "../utils/pagination.utility";
import {authLikeStatus} from "../middlewares/auth";
import {commentsRepositories} from "../repositories/comment-repositories";


export const comRouter = Router({})


postsRouter.get('/:id/comments', async (req: RequestParams<{id: string},{sortBy: string, sortDirection: string, pageNumber: number, pageSize: number}>, res: Response) => {

    const checkPostsComments = await postsService.checkPostCommentCollection(req.params.id)

    if(checkPostsComments) {
        const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

        const postCommentsList = await postsService.getAllPostsComments({
            ...postsQuery,
            ...pagination
        }, req.params.id);

        res.send(postCommentsList)
    } else {
        res.sendStatus(404)
        return
    }
})

comRouter.put('/:id',
    authMiddleware,
    commentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        if(!ObjectId.isValid(req.params.id)){
            res.sendStatus(404)
            return
        }

        let comment = await commentsService.getCommentById(req.params.id)
        if (!comment) {
            res.sendStatus(404)
            return
        }

        const checkOwner = await commentsService.checkOwner(req.user!, req.params.id)
        if(!checkOwner) {
            res.sendStatus(403)
            return
        }

        const isUpdate = await commentsService.updateCommentById(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

comRouter.get('/:id',
    async (req: Request, res: Response) => {
        if(!ObjectId.isValid(req.params.id)){
            res.sendStatus(404)
            return
        }
        let comment = await commentsService.getCommentById(req.params.id)
        if (comment) {
            res.status(200).send(comment)
        } else {
            res.sendStatus(404)
        }

    })

postsRouter.post('/:id/comments',
    authMiddleware,
    commentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        if(!ObjectId.isValid(req.params.id)){
            res.sendStatus(404)
            return
        }

        const checkID = await postsService.checkPostCollection(req.params.id)

        if(checkID) {
            const newPostComment = await postsService.createNewPostComment(req.params.id, req.body, req.user!)
            res.status(201).send(newPostComment)
        } else {
            res.sendStatus(404)
        }
    })

comRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }

    let comment = await commentsService.getCommentById(req.params.id)
    if (!comment) {
        res.sendStatus(404)
        return
    }

    const checkOwner = await commentsService.checkOwner(req.user!, req.params.id)
    if(!checkOwner) {
        res.sendStatus(403)
        return
    }

    const isDelete = await commentsService.deleteCommentById(req.params.id)
    if (isDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

comRouter.put('/:id/like-status',
    authMiddleware,
    authLikeStatus,
    async (req: Request, res: Response) => {
    const checkId = await commentsRepositories.getCommentById(req.params.id)
        if(!checkId) return res.sendStatus(404)

        await commentsService.updateLikeStatus(req.params.id, req.body.likeStatus)
        return res.sendStatus(204)

})
