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
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_db_reposetories_1 = require("../repositories/posts-db-reposetories");
const posts_validation_1 = require("../middlewares/posts/posts-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const authorization_1 = require("../middlewares/authorization");
const pagination_utility_1 = require("../utils/pagination.utility");
const posts_query_utility_1 = require("../utils/posts-query.utility");
const db_1 = require("../db/db");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postsQuery = (0, posts_query_utility_1.getSortPostsQuery)(req.query.sortBy, req.query.sortDirection);
    const pagination = (0, pagination_utility_1.getPaginationData)(req.query.pageNumber, req.query.pageSize);
    const postsCount = yield db_1.postsCollection.estimatedDocumentCount({});
    const { pageNumber, pageSize } = pagination;
    const foundPosts = yield posts_db_reposetories_1.postsReposetories.getAllPosts(Object.assign(Object.assign({}, postsQuery), pagination));
    const postsList = {
        pagesCount: Math.ceil(postsCount / pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: postsCount,
        items: foundPosts
    };
    res.send(postsList);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let post = yield posts_db_reposetories_1.postsReposetories.getPostById(req.params.id);
    if (post) {
        res.status(200).send(post);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postsRouter.post('/', authorization_1.authorizationMiddleware, posts_validation_1.postsValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPosts = yield posts_db_reposetories_1.postsReposetories.createNewPost(req.body);
    res.status(201).send(newPosts);
}));
exports.postsRouter.put('/:id', authorization_1.authorizationMiddleware, posts_validation_1.postsValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdate = yield posts_db_reposetories_1.postsReposetories.updatePostById(req.params.id, req.body);
    if (isUpdate) {
        const post = yield posts_db_reposetories_1.postsReposetories.getPostById(req.params.id);
        res.status(204).send(post);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postsRouter.delete('/:id', authorization_1.authorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDelete = yield posts_db_reposetories_1.postsReposetories.deletePostById(req.params.id);
    if (isDelete) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
