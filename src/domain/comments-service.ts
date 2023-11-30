import {postCommentOutput, postCommentPut} from "../db/types/comments-types";
import {userTypeOutput} from "../db/types/user-types";
import {getMyStatus} from "../utils/getLikeStatus.utility";
import {CommentsRepository} from "../repositories/comments-repository";


export class CommentsService {
    constructor(protected commentsRepositories: CommentsRepository) {}

    async updateCommentById(id: string, data: postCommentPut): Promise<boolean> {
        return await this.commentsRepositories.updateCommentById(id, data)
    }

    async getCommentById(id: string, userId: string): Promise<postCommentOutput | null> {
        const commentInfo = await this.commentsRepositories.getCommentById(id)
        if (!commentInfo) return null

        return {
            id: commentInfo._id.toString(),
            content: commentInfo.content,
            commentatorInfo: commentInfo.commentatorInfo,
            createdAt: commentInfo.createdAt,
            likesInfo: {
                likesCount: commentInfo.likesInfo.countLike,
                dislikesCount: commentInfo.likesInfo.countDislike,
                myStatus: await getMyStatus(id, userId)
            }
        }
    }

    async deleteCommentById(id: string): Promise<boolean> {
        return this.commentsRepositories.deleteCommentById(id)
    }

    async checkOwner(user: userTypeOutput, id: string) {
        const comment = await this.commentsRepositories.getCommentById(id)
        const userId = comment?.commentatorInfo.userId
        return user.id === userId;
    }

    async updateLikeStatus(id: string, likeStatus: string, userId: string) {
        const checkOnLike = await this.commentsRepositories.getLikeStatus(id, userId)
        if (checkOnLike && likeStatus === 'None') {
            return await this.commentsRepositories.updateLikeToNoneStatus(id, userId)
        } else if (checkOnLike && likeStatus === 'Dislike') {
            return await this.commentsRepositories.updateLikeToDislike(id, userId)
        } else if (checkOnLike && likeStatus === 'Like') return


        const checkDislike = await this.commentsRepositories.getDislikeStatus(id, userId)
        if (checkDislike && likeStatus === 'None') {
            return await this.commentsRepositories.updateDislikeToNoneStatus(id, userId)
        } else if (checkDislike && likeStatus === 'Like') {
            return await this.commentsRepositories.updateDislikeToLike(id, userId)
        } else if (checkDislike && likeStatus === 'Dislike') return


        if (likeStatus === 'Like') {
            return await this.commentsRepositories.updateLikeStatus(id, userId)
        }

        if (likeStatus === 'Dislike') {
            return await this.commentsRepositories.updateDislikeStatus(id, userId)
        }

        if (likeStatus === 'None') return
    }

    async getLikeStatus(commentId: string, userId: string) {
        return await this.commentsRepositories.getLikeStatus(commentId, userId)
    }

    async getDislikeStatus(commentId: string, userId: string) {
        return await this.commentsRepositories.getDislikeStatus(commentId, userId)
    }
}