import {Request, Response, Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {ObjectId} from "mongodb";
import {commentValidation} from "../middlewares/posts/comment-validation";
import {commentsService} from "../domain/comments-service";


export const comRouter = Router({})


comRouter.put('/:id',
    authorizationMiddleware,
    commentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        if(!ObjectId.isValid(req.params.id)){
            res.sendStatus(404)
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

comRouter.delete('/:id', authorizationMiddleware, async (req: Request, res: Response) => {
    if(!ObjectId.isValid(req.params.id)){
        res.sendStatus(404)
        return
    }
    const isDelete = await commentsService.deleteCommentById(req.params.id)
    if (isDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})