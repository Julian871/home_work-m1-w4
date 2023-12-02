import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersValidation} from "../middlewares/users/users-validation";
import {checkValidParams} from "../middlewares/auth";
import {usersController} from "../composition-root";

export const usersRouter = Router({})

usersRouter
    .get('/', authorizationMiddleware, usersController.getUsers.bind(usersController))
    .post('/', authorizationMiddleware, usersValidation, inputValidationMiddleware, usersController.createUser.bind(usersController))
    .delete('/:id', checkValidParams, inputValidationMiddleware, authorizationMiddleware, usersController.deleteUser.bind(usersController))