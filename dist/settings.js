"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_routers_1 = require("./routers/blogs-routers");
const post_routers_1 = require("./routers/post-routers");
const body_parser_1 = __importDefault(require("body-parser"));
const delete_all_1 = require("./routers/delete-all");
exports.app = (0, express_1.default)();
const jsonBodyMiddleware = body_parser_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use('/blogs', blogs_routers_1.blogsRouter);
exports.app.use('/posts', post_routers_1.postsRouter);
exports.app.use('/testing/all-data', delete_all_1.testingRouter);
