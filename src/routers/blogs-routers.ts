import {Request, Response, Router} from "express";
import {blogsValidation} from "../middlewares/blogs/blogs-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization";
import {RequestParams, RequestQueryParams} from "../db/types/query-types";
import {getPaginationData} from "../utils/pagination.utility";
import {getSortBlogsQuery} from "../utils/blogs-query.utility";
import {postsBlogIdValidation} from "../middlewares/posts/postBlogId-validation";
import {getSortPostsQuery} from "../utils/posts-query.utility";
import {BlogsService} from "../domain/blogs-service";
import {checkHeadersBeforeLike} from "../utils/getLikeStatus.utility";
import {checkValidParams} from "../middlewares/auth";
import {blogsController} from "../composition-root";


export const blogsRouter = Router({})

export class BlogsController {
    constructor(protected blogsService: BlogsService) {}

    async getBlogs(req: RequestQueryParams<{
        searchNameTerm: string | null,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    }>, res: Response) {

        const blogsQuery = getSortBlogsQuery(req.query.searchNameTerm, req.query.sortBy, req.query.sortDirection)
        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

        const blogList = await this.blogsService.getAllBlogs({
            ...blogsQuery,
            ...pagination
        })

        res.send(blogList)
    }

    async getBlog(req: Request, res: Response) {

        let blog = await this.blogsService.getBlogById(req.params.id)
        if (blog) {
            res.status(200).send(blog)
        } else {
            res.sendStatus(404)
        }
    }

    async createPostByBlogId(req: Request, res: Response) {
        const createPost = await this.blogsService.createNewPostByBlogId(req.params.blogId, req.body)
        if (!createPost) {
            res.sendStatus(404)
        } else {
            res.status(201).send(createPost)
        }
    }

    async getPostsByBlogId(req: RequestParams<{ blogId: string }, {
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    }>, res: Response) {
        const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        const foundPosts = await this.blogsService.getPostByBlogId({
            ...postsQuery,
            ...pagination
        }, req.params.blogId, userId)

        if (foundPosts.items.length > 0) {
            res.send(foundPosts)
        } else {
            res.sendStatus(404)
        }
    }

    async createBlog(req: Request, res: Response) {
        const newBlogs = await this.blogsService.createNewBlog(req.body)
        res.status(201).send(newBlogs)
    }

    async updateBlog(req: Request, res: Response) {
        const isUpdate = await this.blogsService.updateBlogById(req.params.id, req.body)
        if (isUpdate) {
            const blog = await this.blogsService.getBlogById(req.params.id)
            res.status(204).send(blog)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        const isDelete = await this.blogsService.deleteBlogById(req.params.id)
        if (isDelete) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}

blogsRouter
    .get('/', blogsController.getBlogs.bind(blogsController))
    .get('/:id', checkValidParams, inputValidationMiddleware, blogsController.getBlog.bind(blogsController))
    .post('/:blogId/posts', authorizationMiddleware, postsBlogIdValidation, inputValidationMiddleware, blogsController.createPostByBlogId.bind(blogsController))
    .get('/:blogId/posts', blogsController.getPostsByBlogId.bind(blogsController))
    .post('/', authorizationMiddleware, blogsValidation, inputValidationMiddleware, blogsController.createBlog.bind(blogsController))
    .put('/:id', checkValidParams, authorizationMiddleware, blogsValidation, inputValidationMiddleware, blogsController.updateBlog.bind(blogsController))
    .delete('/:id', checkValidParams, inputValidationMiddleware, authorizationMiddleware, blogsController.deleteBlog.bind(blogsController))