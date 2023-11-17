import {commentsRepositories} from "../repositories/comment-repositories";
import {postsRepositories} from "../repositories/posts-db-repositories";


export async function getMyStatus(commentId: string, userId: string) {
    const checkLikeStatus = await commentsRepositories.getLikeStatus(commentId, userId)
    if(checkLikeStatus) return 'Like'

    const checkDislikeStatus = await commentsRepositories.getDislikeStatus(commentId, userId)
    if(checkDislikeStatus) return 'Dislike'
    return 'None'
}

export async function getMyStatusToPost(commentId: string, userId: string) {
    const checkLikeStatus = await postsRepositories.getLikeStatus(commentId, userId)
    if(checkLikeStatus) return 'Like'

    const checkDislikeStatus = await postsRepositories.getDislikeStatus(commentId, userId)
    if(checkDislikeStatus) return 'Dislike'
    return 'None'
}

export async function getLikeListToPost(id: string) {
    const post = await postsRepositories.getLikeListToPost(id)
    if(!post) return
    return post.extendedLikesInfo.likeList.reverse()
}