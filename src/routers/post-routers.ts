import {Router} from "express";
import {postsValidation} from "../middlewares/posts/posts-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware, authorizationMiddleware} from "../middlewares/authorization";
import {authLikeStatus, checkValidParams} from "../middlewares/auth";
import {commentValidation} from "../middlewares/posts/comment-validation";
import {postsController} from "../composition-root";


export const postsRouter = Router({})

postsRouter
    .get('/', postsController.getPosts.bind(postsController))
    .get('/:id', checkValidParams, inputValidationMiddleware, postsController.getPost.bind(postsController))
    .post('/', authorizationMiddleware, postsValidation, inputValidationMiddleware, postsController.createPost.bind(postsController))
    .put('/:id', checkValidParams, authorizationMiddleware, postsValidation, inputValidationMiddleware, postsController.updatePost.bind(postsController))
    .put('/:id/like-status', authLikeStatus, authMiddleware, inputValidationMiddleware, postsController.updateLikeStatusToPost.bind(postsController))
    .delete('/:id', checkValidParams, inputValidationMiddleware, authorizationMiddleware, postsController.deletePost.bind(postsController))
    .get('/:id/comments', postsController.getCommentsToPost.bind(postsController))
    .post('/:id/comments', authMiddleware, checkValidParams, commentValidation, inputValidationMiddleware, postsController.createCommentToPost.bind(postsController))