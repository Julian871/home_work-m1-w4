import {Request, Response, Router} from "express";
import {authMiddleware} from "../middlewares/authorization";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {commentValidation} from "../middlewares/posts/comment-validation";
import {commentsService} from "../domain/comments-service";
import {commentsRepositories} from "../repositories/comment-repositories";
import {authLikeStatus, checkValidParams} from "../middlewares/auth";
import {checkHeadersBeforeLike} from "../utils/getLikeStatus.utility";


export const comRouter = Router({})


comRouter
    .put('/:id',
        checkValidParams,
        authMiddleware,
        commentValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const userId = await checkHeadersBeforeLike(req.headers.authorization!)

            let comment = await commentsService.getCommentById(req.params.id, userId)
            if (!comment) {
                res.sendStatus(404)
                return
            }

            const checkOwner = await commentsService.checkOwner(req.user!, req.params.id)
            if (!checkOwner) {
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

    .get('/:id',
        checkValidParams,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const userId = await checkHeadersBeforeLike(req.headers.authorization!)

            const comment = await commentsService.getCommentById(req.params.id, userId)
            if (comment) {
                res.status(200).send(comment)
            } else {
                res.sendStatus(404)
            }

        })


    .delete('/:id',
        checkValidParams,
        inputValidationMiddleware,
        authMiddleware, async (req: Request, res: Response) => {
            const userId = await checkHeadersBeforeLike(req.headers.authorization!)

            let comment = await commentsService.getCommentById(req.params.id, userId)
            if (!comment) {
                res.sendStatus(404)
                return
            }

            const checkOwner = await commentsService.checkOwner(req.user!, req.params.id)
            if (!checkOwner) {
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

    .put('/:id/like-status',
        authLikeStatus,
        authMiddleware,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const checkId = await commentsRepositories.getCommentById(req.params.id)
            if (!checkId) return res.sendStatus(404)
            if (!req.user) return res.status(404).send('no user')

            await commentsService.updateLikeStatus(req.params.id, req.body.likeStatus, req.user.id)
            return res.sendStatus(204)
        })
