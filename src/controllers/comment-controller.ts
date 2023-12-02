import {CommentsService} from "../application/comments-service";
import {Request, Response} from "express";
import {checkHeadersBeforeLike} from "../utils/getLikeStatus.utility";
import {injectable} from "inversify";


@injectable()
export class CommentController {
    constructor(protected commentsService: CommentsService) {}

    async updateComment(req: Request, res: Response) {
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        let comment = await this.commentsService.getCommentById(req.params.id, userId)
        if (!comment) {
            res.sendStatus(404)
            return
        }

        const checkOwner = await this.commentsService.checkOwner(req.user!, req.params.id)
        if (!checkOwner) {
            res.sendStatus(403)
            return
        }

        const isUpdate = await this.commentsService.updateCommentById(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async getComment(req: Request, res: Response) {
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        const comment = await this.commentsService.getCommentById(req.params.id, userId)
        if (comment) {
            res.status(200).send(comment)
        } else {
            res.sendStatus(404)
        }

    }

    async deleteComment(req: Request, res: Response) {
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        let comment = await this.commentsService.getCommentById(req.params.id, userId)
        if (!comment) {
            res.sendStatus(404)
            return
        }

        const checkOwner = await this.commentsService.checkOwner(req.user!, req.params.id)
        if (!checkOwner) {
            res.sendStatus(403)
            return
        }

        const isDelete = await this.commentsService.deleteCommentById(req.params.id)
        if (isDelete) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async updateLikeStatusToComment(req: Request, res: Response) {
        const checkId = await this.commentsService.getCommentById(req.params.id, '0')
        if (!checkId) return res.sendStatus(404)
        if (!req.user) return res.status(404).send('no user')

        await this.commentsService.updateLikeStatus(req.params.id, req.body.likeStatus, req.user.id)
        return res.sendStatus(204)
    }
}