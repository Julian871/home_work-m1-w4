import {
    getPostsQueryType, PostCreator, PostInfo,
    postTypePostPut
} from "../db/types/post-types";
import {headTypes, PageInfo} from "../db/types/head-types";
import {
    CommentCreator,
    CommentInfo,
    postCommentPut
} from "../db/types/comments-types";
import {userTypeOutput} from "../db/types/user-types";
import {getLikeListToPost, getMyStatus, getMyStatusToPost} from "../utils/getLikeStatus.utility";
import {PostsRepository} from "../repositories/posts-repository";


export class PostsService {

    constructor(protected postsRepositories: PostsRepository) {}

    async getAllPosts(query: getPostsQueryType, userId: string): Promise<headTypes> {
        const countPosts = await this.postsRepositories.countPosts()
        const allPosts = await this.postsRepositories.getAllPosts(query)
        const filterPosts = await Promise.all(allPosts.map(async (p) => (
            new PostInfo(p._id.toString(), p.title, p.shortDescription, p.content, p.blogId, p.blogName, p.createdAt,
                p.extendedLikesInfo.countLike, p.extendedLikesInfo.countDislike,
                await getMyStatusToPost(p._id.toString(), userId),
                await getLikeListToPost(p._id.toString())
            ))))
        return new PageInfo(query.pageNumber, query.pageSize, countPosts, filterPosts)
    }

    async getAllPostsComments(query: getPostsQueryType, id: string, userId: string): Promise<headTypes> {
        const countPostsComments = await this.postsRepositories.countPostsComments(id)
        const allPostsComments = await this.postsRepositories.getAllPostsComments(query, id)
        const filterPostsComments = await Promise.all(allPostsComments.map(async (p) => (
            new CommentInfo(id, p.content, userId, p.commentatorInfo.userLogin, p.createdAt,
                p.likesInfo.countLike, p.likesInfo.countDislike, await getMyStatus(id, userId))
        )))

        return new PageInfo(query.pageNumber, query.pageSize, countPostsComments, filterPostsComments)
    }

    async getPostById(id: string, userId: string) {
        const post = await this.postsRepositories.getPostById(id)
        if (!post) {
            return null
        }
        return new PostInfo(id, post.title, post.shortDescription, post.content, post.blogId, post.blogName, post.createdAt,
            post.extendedLikesInfo.countLike, post.extendedLikesInfo.countDislike,
            await getMyStatusToPost(id, userId),
            await getLikeListToPost(id))
    }

    async createNewPost(data: postTypePostPut) {
        const newPost = new PostCreator(data.title, data.shortDescription, data.content, data.blogId)
        await this.postsRepositories.createNewPost(newPost)

        return new PostInfo(newPost._id.toString(), newPost.title, newPost.shortDescription,
            newPost.content, newPost.blogId, newPost.blogName, newPost.createdAt, 0, 0, 'None', [])
    }

    async createNewPostComment(idPost: string, data: postCommentPut, user: userTypeOutput) {

        const newComment = new CommentCreator(data.content, user.id, user.login, idPost)
        await this.postsRepositories.createNewPostComment(newComment)
        return new CommentInfo(newComment._id.toString(), data.content, user.id, user.login,
            newComment.createdAt, 0, 0, 'None')
    }

    async checkPostCollection(id: string): Promise<boolean> {
        return this.postsRepositories.checkPostCollection(id)
    }

    async checkPostCommentCollection(id: string): Promise<boolean> {
        return this.postsRepositories.checkPostCommentCollection(id)
    }

    async updatePostById(id: string, data: postTypePostPut): Promise<boolean> {
        return this.postsRepositories.updatePostById(id, data)
    }

    async deletePostById(id: string): Promise<boolean> {
        return this.postsRepositories.deletePostById(id)
    }

    async updateLikeStatus(id: string, likeStatus: string, userId: string, login: string) {
        const newLike = {
            addedAt: new Date(),
            userId: userId,
            login: login
        }
        const checkOnLike = await this.postsRepositories.getLikeStatus(id, userId)
        if (checkOnLike && likeStatus === 'None') {
            return await this.postsRepositories.updateLikeToNoneStatus(id, userId)
        } else if (checkOnLike && likeStatus === 'Dislike') {
            return await this.postsRepositories.updateLikeToDislike(id, userId)
        } else if (checkOnLike && likeStatus === 'Like') return


        const checkDislike = await this.postsRepositories.getDislikeStatus(id, userId)
        if (checkDislike && likeStatus === 'None') {
            return await this.postsRepositories.updateDislikeToNoneStatus(id, userId)
        } else if (checkDislike && likeStatus === 'Like') {
            return await this.postsRepositories.updateDislikeToLike(id, newLike, userId)
        } else if (checkDislike && likeStatus === 'Dislike') return


        if (likeStatus === 'Like') {
            return await this.postsRepositories.updateLikeStatus(id, newLike)
        }

        if (likeStatus === 'Dislike') {
            return await this.postsRepositories.updateDislikeStatus(id, userId)
        }

        if (likeStatus === 'None') return
    }

    async getLikeStatus(commentId: string, userId: string) {
        return await this.postsRepositories.getLikeStatus(commentId, userId)
    }

    async getDislikeStatus(commentId: string, userId: string) {
        return await this.postsRepositories.getDislikeStatus(commentId, userId)
    }

    async getLikeListToPost(id: string) {
        return await this.postsRepositories.getLikeListToPost(id)
    }
}