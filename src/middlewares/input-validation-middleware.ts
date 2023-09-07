import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";


export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errorFormatrer = ({msg, path}: any) => {
        return {
            message: msg,
            field: path
        }
    }
    const errors = validationResult(req).formatWith(errorFormatrer)
    if(!errors.isEmpty()){
        res.status(400).json({errorsMessages: errors.array({onlyFirstError: true})})
    } else {
        next()
    }
}
