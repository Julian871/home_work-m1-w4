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
const pagination_utility_1 = require("../utils/pagination.utility");
const blogs_query_utility_1 = require("../utils/blogs-query.utility");
const db_1 = require("../db/db");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogsQuery = (0, blogs_query_utility_1.getSortBlogsQuery)(req.query.searchNameTerm, req.query.sortBy, req.query.sortDirection);
    const pagination = (0, pagination_utility_1.getPaginationData)(req.query.pageNumber, req.query.pageSize);
    const blogsCount = yield db_1.blogsCollection.estimatedDocumentCount({});
    const { pageNumber, pageSize } = pagination;
    const foundBlogs = yield blogs_db_reposetories_1.blogsRepositories.getAllBlogs(Object.assign(Object.assign({}, blogsQuery), pagination));
    const blogList = {
        pagesCount: Math.ceil(blogsCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: blogsCount,
        items: foundBlogs
    };
    res.send(blogList);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isValid = mongodb_1.ObjectId.isValid(req.params.id);
    if (!isValid) {
        res.sendStatus(404);
        return;
    }
    let blog = yield blogs_db_reposetories_1.blogsRepositories.getBlogById(req.params.id);
    if (blog) {
        res.status(200).send(blog);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.post('/', authorization_1.authorizationMiddleware, blogs_validation_1.blogsValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlogs = yield blogs_db_reposetories_1.blogsRepositories.createNewBlog(req.body);
    res.status(201).send(newBlogs);
}));
exports.blogsRouter.put('/:id', authorization_1.authorizationMiddleware, blogs_validation_1.blogsValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdate = yield blogs_db_reposetories_1.blogsRepositories.updateBlogById(req.params.id, req.body);
    if (isUpdate) {
        const blog = yield blogs_db_reposetories_1.blogsRepositories.getBlogById(req.params.id);
        res.status(204).send(blog);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.delete('/:id', authorization_1.authorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDelete = yield blogs_db_reposetories_1.blogsRepositories.deleteBlogById(req.params.id);
    if (isDelete) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
