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
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_db_reposetories_1 = require("../repositories/blogs-db-reposetories");
const blogs_validation_1 = require("../middlewares/blogs/blogs-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const authorization_1 = require("../middlewares/authorization");
const mongodb_1 = require("mongodb");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchNameTerm = req.query.searchNameTerm || null;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDirection = req.query.sortDirection || 'desc';
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 10;
    const foundBlogs = yield blogs_db_reposetories_1.blogsReposetories.getAllBlogs();
    const bloglist = {
        pagesCount: Math.ceil(foundBlogs.length / 10),
        page: pageNumber,
        pageSize,
        totalCount: foundBlogs.length,
        items: foundBlogs.sort().slice(0, 10)
    };
    res.send(bloglist);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isValid = mongodb_1.ObjectId.isValid(req.params.id);
    if (!isValid) {
        res.sendStatus(404);
        return;
    }
    let blog = yield blogs_db_reposetories_1.blogsReposetories.getBlogById(req.params.id);
    if (blog) {
        res.status(200).send(blog);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.post('/', authorization_1.authorizationMiddleware, blogs_validation_1.blogsValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlogs = yield blogs_db_reposetories_1.blogsReposetories.createNewBlog(req.body);
    res.status(201).send(newBlogs);
}));
exports.blogsRouter.put('/:id', authorization_1.authorizationMiddleware, blogs_validation_1.blogsValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdate = yield blogs_db_reposetories_1.blogsReposetories.updateBlogById(req.params.id, req.body);
    if (isUpdate) {
        const blog = yield blogs_db_reposetories_1.blogsReposetories.getBlogById(req.params.id);
        res.status(204).send(blog);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.delete('/:id', authorization_1.authorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDelete = yield blogs_db_reposetories_1.blogsReposetories.deleteBlogById(req.params.id);
    if (isDelete) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
