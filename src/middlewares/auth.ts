import {body, param} from "express-validator";
import {ObjectId} from "mongodb";


export const authCode = [
    body('code').isString().withMessage('code is not string'),
    body('code').trim().isLength({min: 1}).withMessage('code is incorrect length')
]

export const authValidation = [
    body('loginOrEmail').isString().withMessage('login or Email is not string'),
    body('loginOrEmail').trim().isLength({min: 1}).withMessage('Login or Email is incorrect length'),
    body('password').isString().withMessage('password is not string'),
    body('password').trim().isLength({min: 1}).withMessage('password is incorrect length')
]

export const authEmail = [
    body('email').isString().withMessage('email is not string'),
    body('email').trim().isLength({min: 1}).withMessage('email is incorrect length'),
    body('email').isEmail().withMessage('is not email'),
]


export const authRecoveryPassword = [
    body('newPassword').isString().withMessage('password is not string'),
    body('newPassword').trim().isLength({min: 6, max: 20}).withMessage('password is incorrect length'),
    body('recoveryCode').isString().withMessage('recovery code is not string'),
]

export const authLikeStatus = [
    body('likeStatus')
        .isString()
        .withMessage('is not string')
        .isIn(['Like', 'Dislike', 'None'])
        .withMessage('incorrect status')
]

export const checkValidParams = [
    param('')
        .custom(async (value) => {
            if (!ObjectId.isValid(value)) {
                throw new Error('params id')
            }
        })
]