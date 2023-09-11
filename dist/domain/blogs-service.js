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
exports.blogsService = void 0;
const blogs_db_reposetories_1 = require("../repositories/blogs-db-reposetories");
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const default_param_1 = require("../utils/default-param");
exports.blogsService = {
    getAllBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield db_1.blogsCollection.find({
                name: { $regex: query.searchNameTerm ? query.searchNameTerm : '', $options: 'i' }
            }).sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(+query.pageSize)
                .toArray();
            return yield blogs_db_reposetories_1.blogsRepositories.getAllBlogs(blogs);
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_reposetories_1.blogsRepositories.getBlogById(id);
        });
    },
    getPostByBlogId(blogId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const _blogId = new mongodb_1.ObjectId(blogId).toString();
            const postsCount = yield db_1.postsCollection.countDocuments({
                blogId: { $regex: _blogId ? _blogId : '', $options: 'i' }
            });
            const posts = yield db_1.postsCollection.find({
                blogId: { $regex: _blogId ? _blogId : '', $options: 'i' }
            }).sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(+query.pageSize)
                .toArray();
            const foundPosts = yield blogs_db_reposetories_1.blogsRepositories.getPostByBlogId(posts);
            return {
                pagesCount: Math.ceil(postsCount / (+query.pageSize | default_param_1.DEFAULT_PAGE_SIZE)),
                page: +query.pageNumber | default_param_1.DEFAULT_PAGE_NUMBER,
                pageSize: +query.pageSize | default_param_1.DEFAULT_PAGE_SIZE,
                totalCount: postsCount,
                items: foundPosts
            };
        });
    },
    createNewBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = Object.assign(Object.assign({ _id: new mongodb_1.ObjectId() }, data), { createdAt: new Date().toISOString(), isMembership: false });
            return yield blogs_db_reposetories_1.blogsRepositories.createNewBlog(newBlog);
        });
    },
    createNewPostByBlogId(blogId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const _blogId = new mongodb_1.ObjectId(blogId);
            const checkBlogId = yield db_1.blogsCollection.findOne({ _id: _blogId });
            if (!checkBlogId) {
                return false;
            }
            else {
                const newPost = Object.assign(Object.assign({ _id: new mongodb_1.ObjectId() }, data), { blogId: _blogId.toString(), blogName: (Math.random() * 100).toString(), createdAt: new Date().toISOString() });
                return yield blogs_db_reposetories_1.blogsRepositories.createNewPostByBlogId(newPost);
            }
        });
    },
    updateBlogById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_reposetories_1.blogsRepositories.updateBlogById(id, data);
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_reposetories_1.blogsRepositories.deleteBlogById(id);
        });
    }
};
