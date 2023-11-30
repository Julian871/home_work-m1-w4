import {jwtService} from "../application/jwt-service";
import {commentService, postsService} from "../composition-root";


export async function getMyStatus(commentId: string, userId: string) {

    const checkLikeStatus = await commentService.getLikeStatus(commentId, userId)
    if (checkLikeStatus) return 'Like'

    const checkDislikeStatus = await commentService.getDislikeStatus(commentId, userId)
    if (checkDislikeStatus) return 'Dislike'
    return 'None'
}

export async function getMyStatusToPost(commentId: string, userId: string) {
    const checkLikeStatus = await postsService.getLikeStatus(commentId, userId)
    if (checkLikeStatus) return 'Like'

    const checkDislikeStatus = await postsService.getDislikeStatus(commentId, userId)
    if (checkDislikeStatus) return 'Dislike'
    return 'None'
}

export async function getLikeListToPost(id: string) {
    const post = await postsService.getLikeListToPost(id)
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