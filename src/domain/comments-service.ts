import {postCommentOutput, postCommentPut} from "../db/types/comments-types";
import {commentsRepositories} from "../repositories/comment-repositories";
import {userTypeOutput} from "../db/types/user-types";
import {getLikeList, getMyStatus} from "../utils/likeStatus.utility";


export const commentsService = {
    async updateCommentById(id: string, data: postCommentPut): Promise<boolean> {
        return commentsRepositories.updateCommentById(id, data)
    },

    async getCommentById(id: string, userId: string): Promise<postCommentOutput | null>{
        const commentInfo = await commentsRepositories.getCommentById(id)
        if(!commentInfo) return null

            return {
                id: commentInfo._id.toString(),
                content: commentInfo.content,
                commentatorInfo: commentInfo.commentatorInfo,
                createdAt: commentInfo.createdAt,
                extendedLikesInfo: {
                    likesCount: commentInfo.likesInfo.countLike,
                    dislikesCount: commentInfo.likesInfo.countDislike,
                    myStatus: await getMyStatus(id, userId),
                    newestLikes: await getLikeList(id)
                }
            }
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return commentsRepositories.deleteCommentById(id)
    },

    async checkOwner(user: userTypeOutput, id: string) {
        const comment = await commentsRepositories.getCommentById(id)
        const userId = comment?.commentatorInfo.userId
        return user.id === userId;
    },

    async updateLikeStatus(id: string, likeStatus: string, userId: string, login: string) {
        const newLike = {
            date: new Date(),
            userId: userId,
            login: login
        }

        const checkOnLike = await commentsRepositories.getLikeStatus(id, userId)
        console.log('checkOnLike: ', checkOnLike)
        if(checkOnLike && likeStatus === 'None') {
            return await commentsRepositories.updateLikeToNoneStatus(id, userId)
        } else if(checkOnLike && likeStatus === 'Dislike') {
            return await commentsRepositories.updateLikeToDislike(id, userId)
        } else if(checkOnLike && likeStatus === 'Like') return


        const checkDislike = await commentsRepositories.getDislikeStatus(id, userId)
        if(checkDislike && likeStatus === 'None') {
            return await commentsRepositories.updateDislikeToNoneStatus(id, userId)
        } else if(checkDislike && likeStatus === 'Like') {
            return await commentsRepositories.updateDislikeToLike(id, newLike, userId)
        } else if(checkDislike && likeStatus === 'Dislike') return


        if(likeStatus === 'Like') {
            return await commentsRepositories.updateLikeStatus(id, newLike)
        }

        if(likeStatus === 'Dislike') {
            return await commentsRepositories.updateDislikeStatus(id, userId)
        }

        if(likeStatus === 'None') return
    },
}