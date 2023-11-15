import {commentsRepositories} from "../repositories/comment-repositories";


export async function getMyStatus(commentId: string, userId: string) {
    const checkLikeStatus = await commentsRepositories.getLikeStatus(commentId, userId)
    if(checkLikeStatus) return 'Like'

    const checkDislikeStatus = await commentsRepositories.getDislikeStatus(commentId, userId)
    if(checkDislikeStatus) return 'Dislike'
    return 'None'
}