import {PostsService} from "../domain/posts-service";
import {RequestParams, RequestQueryParams} from "../db/types/query-types";
import {Request, Response} from "express";
import {getSortPostsQuery} from "../utils/posts-query.utility";
import {getPaginationData} from "../utils/pagination.utility";
import {checkHeadersBeforeLike} from "../utils/getLikeStatus.utility";


export class PostsController {
    constructor(protected postsService: PostsService) {}

    async getPosts(req: RequestQueryParams<{
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    }>, res: Response) {

        const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
        const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        const postList = await this.postsService.getAllPosts({
            ...postsQuery,
            ...pagination
        }, userId)

        res.send(postList)
    }

    async getPost(req: Request, res: Response) {
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        let post = await this.postsService.getPostById(req.params.id, userId)
        if (post) {
            res.status(200).send(post)
        } else {
            res.sendStatus(404)
        }
    }

    async createPost(req: Request, res: Response) {
        const newPosts = await this.postsService.createNewPost(req.body)
        res.status(201).send(newPosts)
    }

    async updatePost(req: Request, res: Response) {
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        const isUpdate = await this.postsService.updatePostById(req.params.id, req.body)
        if (isUpdate) {
            const post = await this.postsService.getPostById(req.params.id, userId)
            res.status(204).send(post)
        } else {
            res.sendStatus(404)
        }
    }

    async updateLikeStatusToPost(req: Request, res: Response) {
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        const checkId = await this.postsService.getPostById(req.params.id, userId)
        if (!checkId) return res.sendStatus(404)
        if (!req.user) return res.status(404).send('no user')

        await this.postsService.updateLikeStatus(req.params.id, req.body.likeStatus, req.user.id, req.user.login)
        return res.sendStatus(204)
    }

    async deletePost(req: Request, res: Response) {
        const isDelete = await this.postsService.deletePostById(req.params.id)
        if (isDelete) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async getCommentsToPost(req: RequestParams<{ id: string }, {
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    }>, res: Response) {

        const checkPostsComments = await this.postsService.checkPostCommentCollection(req.params.id)
        const userId = await checkHeadersBeforeLike(req.headers.authorization!)

        if (checkPostsComments) {
            const postsQuery = getSortPostsQuery(req.query.sortBy, req.query.sortDirection)
            const pagination = getPaginationData(req.query.pageNumber, req.query.pageSize);

            const postCommentsList = await this.postsService.getAllPostsComments({
                ...postsQuery,
                ...pagination
            }, req.params.id, userId);

            res.send(postCommentsList)
        } else {
            res.sendStatus(404)
            return
        }
    }

    async createCommentToPost(req: Request, res: Response) {

        const checkID = await this.postsService.checkPostCollection(req.params.id)

        if (checkID) {
            const newPostComment = await this.postsService.createNewPostComment(req.params.id, req.body, req.user!)
            res.status(201).send(newPostComment)
        } else {
            res.sendStatus(404)
        }
    }
}