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
exports.postsReposetories = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
exports.postsReposetories = {
    getAllPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.postsCollection.find({})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(+query.pageSize)
                .sort({ [query.sortBy]: query.sortDirection })
                .toArray();
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
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(id);
            const post = yield db_1.postsCollection.findOne({ _id: _id });
            if (!post) {
                return null;
            }
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            };
        });
    },
    createNewPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = Object.assign(Object.assign({ _id: new mongodb_1.ObjectId() }, data), { blogName: (Math.random() * 100).toString(), createdAt: new Date().toISOString() });
            yield db_1.postsCollection.insertOne(newPost);
            return {
                id: newPost._id.toString(),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt
            };
        });
    },
    updatePostById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(id);
            const result = yield db_1.postsCollection.updateOne({ _id: _id }, {
                $set: {
                    title: data.title,
                    shortDescription: data.shortDescription,
                    content: data.content,
                    blogId: data.blogId
                }
            });
            return result.matchedCount === 1;
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(id);
            const result = yield db_1.postsCollection.deleteOne({ _id: _id });
            return result.deletedCount === 1;
        });
    }
};
