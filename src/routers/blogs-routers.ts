import {Request, Response, Router} from "express";
import {blogsRepositories} from "../repositories/blogs-db-reposetories";
import {blogsValidation} from "../middlewares/blogs/blogs-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorizationMiddleware} from "../middlewares/authorization";
import {blogTypeOutput} from "../db/types/blog-types";
import {ObjectId} from "mongodb";
import {RequestParams, RequestQueryParams} from "../db/types/query-types";
import {getPaginationData} from "../utils/pagination.utility";
import {getSortBlogsQuery} from "../utils/blogs-query.utility";
import {blogsCollection, postsCollection} from "../db/db";
import {postsBlogIdValidation} from "../middlewares/posts/postBlogId-validation";
import {getSortPostsQuery} from "../utils/posts-query.utility";

export const blogsRouter = Router({})



blogsRouter.get('/',async (req: RequestQueryParams<{searchNameTerm: string | null, sortBy: string, sortDirection: string, pageNumber: number, pageSize: number}>, res: Response) => {

    const blogsQuery = getSortBlogsQuery(req.query.searchNameTerm, req.query.sortBy, req.query.sortDirection)
    const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

    const blogsCount = await blogsCollection.estimatedDocumentCount({})
    const {pageNumber, pageSize} = pagination;


    const foundBlogs: blogTypeOutput[] = await blogsRepositories.getAllBlogs({
        ...blogsQuery,
        ...pagination
    })

    const blogList = {

        pagesCount: Math.ceil(blogsCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: blogsCount,
        items: foundBlogs
    }
    res.send(blogList)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const isValid = ObjectId.isValid(req.params.id)

    if(!isValid){
        res.sendStatus(404)
        return
    }

    let blog = await blogsRepositories.getBlogById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
    } else {
        res.sendStatus(404)
    }
})


blogsRouter.post('/:blogId/posts',
    authorizationMiddleware,
    postsBlogIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const createPost = await blogsRepositories.createNewPostByBlogId(req.params.blogId, req.body)
        if (createPost === false) {
            res.sendStatus(404)
        } else {
            res.status(201).send(createPost)
        }

})

blogsRouter.get('/:blogId/posts', async (req: RequestParams<{blogId: string}, {sortBy: string, sortDirection: string, pageNumber: number, pageSize: number}>, res: Response) => {
    const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
    const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

    const postsCount = await postsCollection.estimatedDocumentCount({})
    const {pageNumber, pageSize} = pagination;

    const foundPosts = await blogsRepositories.getPostByBlogId({
        ...postsQuery,
        ...pagination
    }, req.params.blogId)

    const postsList = {

        pagesCount: Math.ceil(postsCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: postsCount,
        items: foundPosts
    }
    if (foundPosts.length > 0) {
        res.send(postsList)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.post('/',
    authorizationMiddleware,
    blogsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newBlogs = await blogsRepositories.createNewBlog(req.body)
        res.status(201).send(newBlogs)
})

blogsRouter.put('/:id',
    authorizationMiddleware,
    blogsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isUpdate = await blogsRepositories.updateBlogById(req.params.id, req.body)
        if (isUpdate) {
            const blog = await blogsRepositories.getBlogById(req.params.id)
            res.status(204).send(blog)
        } else {
            res.sendStatus(404)
        }
})

blogsRouter.delete('/:id', authorizationMiddleware, async (req: Request, res: Response) => {
    const isDelete = await blogsRepositories.deleteBlogById(req.params.id)
    if (isDelete) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})