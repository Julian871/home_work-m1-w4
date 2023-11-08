import {body} from "express-validator";


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

export const authAccessToken =  [
    body('accessToken').isString().withMessage('access token is not string'),
    body('accessToken').trim().isLength({min: 1}).withMessage('accessToken is incorrect length')
]

export const authRecoverPassword =  [
    body('newPassword').isString().withMessage('password is not string'),
    body('newPassword').trim().isLength({min: 6, max: 20}).withMessage('password is incorrect length'),
    body('recoveryCode').isString().withMessage('recoveryCode is not string')
]

export const authEmail =  [
    body('email')
        .isString()
        .withMessage('email is not string')
        .trim()
        .isLength({min: 1})
        .withMessage('email is incorrect length')
        .isEmail()
        .normalizeEmail()
        .withMessage('invalid email')
]