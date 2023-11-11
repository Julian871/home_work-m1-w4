import {postCommentOutput, postCommentPut} from "../db/types/comments-types";
import {commentsRepositories} from "../repositories/comment-repositories";
import {userTypeOutput} from "../db/types/user-types";


export const commentsService = {
    async updateCommentById(id: string, data: postCommentPut): Promise<boolean> {
        return commentsRepositories.updateCommentById(id, data)
    },

    async getCommentById(id: string): Promise<postCommentOutput | null>{
        return commentsRepositories.getCommentById(id)
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return commentsRepositories.deleteCommentById(id)
    },

    async checkOwner(user: userTypeOutput, id: string) {
        const comment = await commentsRepositories.getCommentById(id)
        const userId = comment?.commentatorInfo.userId
        return user.id === userId;
    },

    async updateLikeStatus(id: string, likeStatus: string) {
        await commentsRepositories.updateLikeStatus(id, likeStatus)
    },

}