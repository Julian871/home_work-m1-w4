import {body} from "express-validator";


export const blogsValidation = [
    body('name').isString().withMessage('name is not string'),
    body('name').trim().isLength({min: 1, max: 15}).withMessage('name is incorrect length'),
    body('description').isString().withMessage('description is not string'),
    body('description').trim().isLength({min: 1, max: 500}).withMessage('description is too long'),
    body('websiteUrl').isString().withMessage('websiteUrl is not string'),
    body('websiteUrl').trim().isLength({min: 1, max: 100}).withMessage('website url is too long'),
    body('websiteUrl').isURL().withMessage('website url does not match the template')
]