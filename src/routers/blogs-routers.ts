import {Router} from "express";
import {blogsValidation} from "../middlewares/blogs/blogs-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization";
import {postsBlogIdValidation} from "../middlewares/posts/postBlogId-validation";
import {checkValidParams} from "../middlewares/auth";
import {blogsController} from "../composition-root";


export const blogsRouter = Router({})

blogsRouter
    .get('/', blogsController.getBlogs.bind(blogsController))
    .get('/:id', checkValidParams, inputValidationMiddleware, blogsController.getBlog.bind(blogsController))
    .post('/:blogId/posts', authorizationMiddleware, postsBlogIdValidation, inputValidationMiddleware, blogsController.createPostByBlogId.bind(blogsController))
    .get('/:blogId/posts', blogsController.getPostsByBlogId.bind(blogsController))
    .post('/', authorizationMiddleware, blogsValidation, inputValidationMiddleware, blogsController.createBlog.bind(blogsController))
    .put('/:id', checkValidParams, authorizationMiddleware, blogsValidation, inputValidationMiddleware, blogsController.updateBlog.bind(blogsController))
    .delete('/:id', checkValidParams, inputValidationMiddleware, authorizationMiddleware, blogsController.deleteBlog.bind(blogsController))