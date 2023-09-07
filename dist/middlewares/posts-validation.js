"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsValidation = void 0;
const express_validator_1 = require("express-validator");
const blogs_db_reposetories_1 = require("../repositories/blogs-db-reposetories");
exports.postsValidation = [
    (0, express_validator_1.body)('title').isString().withMessage('title is not string'),
    (0, express_validator_1.body)('title').trim().isLength({ min: 1, max: 30 }).withMessage('title is too long'),
    (0, express_validator_1.body)('shortDescription').isString().withMessage('shortDescription is not string'),
    (0, express_validator_1.body)('shortDescription').trim().isLength({ min: 1, max: 100 }).withMessage('shortDescription is too long'),
    (0, express_validator_1.body)('content').isString().withMessage('content is not string'),
    (0, express_validator_1.body)('content').trim().isLength({ min: 1, max: 1000 }).withMessage('content is too long'),
    (0, express_validator_1.body)('blogId').isString().withMessage('blogId is not string'),
    (0, express_validator_1.body)('blogId')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blogs_db_reposetories_1.blogsReposetories.getBlogById(value);
        if (!blog) {
            throw new Error('incorrect blogID');
        }
    }))
        .withMessage('incorrect blogID')
];
