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
exports.blogsRepositories = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
exports.blogsRepositories = {
    getAllBlogs(blogs) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs.map((p) => ({
                id: p._id.toString(),
                name: p.name,
                description: p.description,
                websiteUrl: p.websiteUrl,
                createdAt: p.createdAt,
                isMembership: p.isMembership
            }));
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(id);
            return yield db_1.blogsCollection.findOne({ _id: _id });
        });
    },
    getPostByBlogId(posts) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts.map((p) => ({
                id: p._id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt
            }));
        });
    },
    createNewBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.blogsCollection.insertOne(newBlog);
            return newBlog;
        });
    },
    createNewPostByBlogId(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.insertOne(newPost);
            return newPost;
        });
    },
    updateBlogById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(id);
            const result = yield db_1.blogsCollection.updateOne({ _id: _id }, {
                $set: {
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl
                }
            });
            return result.matchedCount === 1;
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(id);
            const result = yield db_1.blogsCollection.deleteOne({ _id: _id });
            return result.deletedCount === 1;
        });
    }
};
