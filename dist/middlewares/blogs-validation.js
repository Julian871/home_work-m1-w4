"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsValidation = void 0;
const express_validator_1 = require("express-validator");
exports.blogsValidation = [
    (0, express_validator_1.body)('name').isString().withMessage('name is not string'),
    (0, express_validator_1.body)('name').trim().isLength({ min: 1, max: 15 }).withMessage('name is incorrect length'),
    (0, express_validator_1.body)('description').isString().withMessage('description is not string'),
    (0, express_validator_1.body)('description').trim().isLength({ min: 1, max: 500 }).withMessage('description is too long'),
    (0, express_validator_1.body)('websiteUrl').isString().withMessage('websiteUrl is not string'),
    (0, express_validator_1.body)('websiteUrl').trim().isLength({ min: 1, max: 100 }).withMessage('website url is too long'),
    (0, express_validator_1.body)('websiteUrl').isURL().withMessage('website url does not match the template')
];
