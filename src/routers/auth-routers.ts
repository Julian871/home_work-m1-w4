import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersValidation} from "../middlewares/users-validation";
import {authCode, authEmail, authRecoveryPassword, authValidation} from "../middlewares/auth";
import {authCookie, authMiddleware} from "../middlewares/authorization";
import {checkConnect} from "../middlewares/connect";
import {AuthController} from "../controllers/auth-controllers";
import {container} from "../composition-root";


const authController = container.resolve(AuthController)

export const authRouter = Router({})

authRouter
    .post('/login', checkConnect, authValidation, inputValidationMiddleware, authController.login.bind(authController))
    .post('/registration-confirmation', checkConnect, authCode, inputValidationMiddleware, authController.regConfirm.bind(authController))
    .post('/registration', checkConnect, usersValidation, inputValidationMiddleware, authController.registration.bind(authController))
    .post('/registration-email-resending', checkConnect, authEmail, inputValidationMiddleware, authController.emailResending.bind(authController))
    .post('/refresh-token', authCookie, authController.refreshToken.bind(authController))
    .get('/me', authMiddleware, authController.me.bind(authController))
    .post('/logout', authCookie, authController.logout.bind(authController))
    .post('/password-recovery', checkConnect, authEmail, inputValidationMiddleware, authController.passwordRecovery.bind(authController))
    .post('/new-password', checkConnect, authRecoveryPassword, inputValidationMiddleware, authController.newPassword.bind(authController))