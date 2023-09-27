import {body} from "express-validator";
import {usersRepositories} from "../../repositories/users-db-repositories";


export const usersValidation = [
    body('login').isString().withMessage('login is not string'),
    body('login').trim().isLength({min: 3, max: 10}).withMessage('name is incorrect length'),
    body('login').matches(/^[a-zA-Z0-9_-]*$/).withMessage('incorrect login'),
    body('login')
        .custom(async (value) => {
            const email = await usersRepositories.getUserByLogin(value)
            if (email !== null) {
                throw new Error('email already exist')
            }
        }),
    body('password').isString().withMessage('login is not string'),
    body('password').trim().isLength({min: 6, max: 20}).withMessage('login is incorrect length'),
    body('email').isString().withMessage('email is not string'),
    body('email').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('incorrect email'),
    body('email')
        .custom(async (value) => {
            const email = await usersRepositories.getUserByEmail(value)
            if (email !== null) {
                throw new Error('email already exist')
            }
        })

]