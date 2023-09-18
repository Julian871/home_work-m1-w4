import {body} from "express-validator";

export const commentValidation = [
    body('content').isString().withMessage('title is not string'),
    body('content').trim().isLength({min: 20, max: 300}).withMessage('incorrect length of title'),

]