"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = void 0;
const authorizationMiddleware = (req, res, next) => {
    if (req.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401);
    }
    else {
        next();
    }
};
exports.authorizationMiddleware = authorizationMiddleware;
