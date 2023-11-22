import {Request, Response, Router} from "express";
import {blogsValidation} from "../middlewares/blogs/blogs-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization";
import {RequestParams, RequestQueryParams} from "../db/types/query-types";
import {getPaginationData} from "../utils/pagination.utility";
import {getSortBlogsQuery} from "../utils/blogs-query.utility";
import {postsBlogIdValidation} from "../middlewares/posts/postBlogId-validation";
import {getSortPostsQuery} from "../utils/posts-query.utility";
import {blogsService} from "../domain/blogs-service";
import {checkHeadersBeforeLike} from "../utils/getLikeStatus.utility";
import {checkValidParams} from "../middlewares/auth";

export const blogsRouter = Router({})


blogsRouter
    .get('/', async (req: RequestQueryParams<{
        searchNameTerm: string | null,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    }>, res: Response) => {

        const blogsQuery = getSortBlogsQuery(req.query.searchNameTerm, req.query.sortBy, req.query.sortDirection)
        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

        const blogList = await blogsService.getAllBlogs({
            ...blogsQuery,
            ...pagination
        })

        res.send(blogList)
    })

    .get('/:id',
        checkValidParams,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {

            let blog = await blogsService.getBlogById(req.params.id)
            if (blog) {
                res.status(200).send(blog)
            } else {
                res.sendStatus(404)
            }
        })


    .post('/:blogId/posts',
        authorizationMiddleware,
        postsBlogIdValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const createPost = await blogsService.createNewPostByBlogId(req.params.blogId, req.body)
            if (!createPost) {
                res.sendStatus(404)
            } else {
                res.status(201).send(createPost)
            }
        })

    .get('/:blogId/posts', async (req: RequestParams<{ blogId: string }, {
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    }>, res: Response) => {
        const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        const foundPosts = await blogsService.getPostByBlogId({
            ...postsQuery,
            ...pagination
        }, req.params.blogId, userId)

        if (foundPosts.items.length > 0) {
            res.send(foundPosts)
        } else {
            res.status(404).send('get blog/blogID/post')
        }
    })

    .post('/',
        authorizationMiddleware,
        blogsValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const newBlogs = await blogsService.createNewBlog(req.body)
            res.status(201).send(newBlogs)
        })

    .put('/:id',
        checkValidParams,
        authorizationMiddleware,
        blogsValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const isUpdate = await blogsService.updateBlogById(req.params.id, req.body)
            if (isUpdate) {
                const blog = await blogsService.getBlogById(req.params.id)
                res.status(204).send(blog)
            } else {
                res.sendStatus(404)
            }
        })

    .delete('/:id',
        checkValidParams,
        inputValidationMiddleware,
        authorizationMiddleware, async (req: Request, res: Response) => {
            const isDelete = await blogsService.deleteBlogById(req.params.id)
            if (isDelete) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        })