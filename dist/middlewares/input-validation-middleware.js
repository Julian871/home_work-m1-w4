"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const errorFormatrer = ({ msg, path }) => {
        return {
            message: msg,
            field: path
        };
    };
    const errors = (0, express_validator_1.validationResult)(req).formatWith(errorFormatrer);
    if (!errors.isEmpty()) {
        res.status(400).json({ errorsMessages: errors.array({ onlyFirstError: true }) });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
