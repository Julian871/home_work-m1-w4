import {postCommentOutput, postCommentPut} from "../db/types/comments-types";
import {commentsRepositories} from "../repositories/comment-repositories";


export const commentsService = {
    async updateCommentById(id: string, data: postCommentPut): Promise<boolean> {
        return commentsRepositories.updateCommentById(id, data)
    },

    async getCommentById(id: string): Promise<postCommentOutput | null>{
        return commentsRepositories.getCommentById(id)
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return commentsRepositories.deleteCommentById(id)
    }

}