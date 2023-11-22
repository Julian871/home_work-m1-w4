import {commentsRepositories} from "../repositories/comment-repositories";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {jwtService} from "../application/jwt-service";


export async function getMyStatus(commentId: string, userId: string) {
    const checkLikeStatus = await commentsRepositories.getLikeStatus(commentId, userId)
    if (checkLikeStatus) return 'Like'

    const checkDislikeStatus = await commentsRepositories.getDislikeStatus(commentId, userId)
    if (checkDislikeStatus) return 'Dislike'
    return 'None'
}

export async function getMyStatusToPost(commentId: string, userId: string) {
    const checkLikeStatus = await postsRepositories.getLikeStatus(commentId, userId)
    if (checkLikeStatus) return 'Like'

    const checkDislikeStatus = await postsRepositories.getDislikeStatus(commentId, userId)
    if (checkDislikeStatus) return 'Dislike'
    return 'None'
}

export async function getLikeListToPost(id: string) {
    const post = await postsRepositories.getLikeListToPost(id)
    if (!post) return
    return post.extendedLikesInfo.likeList.reverse()
}

export async function checkHeadersBeforeLike(auth: string) {
    let userId: string
    if (!auth) {
        userId = '0'
    } else {
        const getUserId = await jwtService.getUserIdToken(auth.split(' ')[1])
        if (!getUserId) {
            userId = '0'
        } else {
            userId = getUserId.toString()
        }
    }
    return userId
}