import {body} from "express-validator";


export const authRegistrationConfirm = [
    body('code').isString().withMessage('login is not string'),
    body('code').trim().isLength({min: 1}).withMessage('name is incorrect length')
]