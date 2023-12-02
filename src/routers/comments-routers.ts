import {Router} from "express";
import {authMiddleware} from "../middlewares/authorization";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {commentValidation} from "../middlewares/comment-validation";
import {authLikeStatus, checkValidParams} from "../middlewares/auth";
import {CommentController} from "../controllers/comment-controller";
import {container} from "../composition-root";


const commentController = container.resolve(CommentController)

export const comRouter = Router({})

comRouter
    .put('/:id', checkValidParams, authMiddleware, commentValidation, inputValidationMiddleware, commentController.updateComment.bind(commentController))
    .get('/:id', checkValidParams, inputValidationMiddleware, commentController.getComment.bind(commentController))
    .delete('/:id', checkValidParams, inputValidationMiddleware, authMiddleware, commentController.deleteComment.bind(commentController))
    .put('/:id/like-status', authLikeStatus, authMiddleware, inputValidationMiddleware, commentController.updateLikeStatusToComment.bind(commentController))
