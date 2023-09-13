import {body} from "express-validator";


export const authValidation = [
    body('loginOrEmail').isString().withMessage('login is not string'),
    body('loginOrEmail').trim().isLength({min: 1}).withMessage('name is incorrect length'),
    body('password').isString().withMessage('login is not string'),
    body('password').trim().isLength({min: 1}).withMessage('login is incorrect length')
]