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
    getAllBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield db_1.blogsCollection.find({
                name: { $regex: query.searchNameTerm ? query.searchNameTerm : '', $options: 'i' }
            }).sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(+query.pageSize)
                .toArray();
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
            const blog = yield db_1.blogsCollection.findOne({ _id: _id });
            if (!blog) {
                return null;
            }
            return {
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            };
        });
    },
    getPostByBlogId(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _blogId = new mongodb_1.ObjectId(blogId).toString();
            const posts = yield db_1.postsCollection.find({
                blogId: { $regex: _blogId ? _blogId : '', $options: 'i' }
            }).sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(+query.pageSize)
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
    createNewBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = Object.assign(Object.assign({ _id: new mongodb_1.ObjectId() }, data), { createdAt: new Date().toISOString(), isMembership: false });
            yield db_1.blogsCollection.insertOne(newBlog);
            return {
                id: newBlog._id.toString(),
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: newBlog.createdAt,
                isMembership: newBlog.isMembership
            };
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
            }
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
