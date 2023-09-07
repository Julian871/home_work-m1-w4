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
exports.runDb = exports.postsCollection = exports.blogsCollection = exports.db = exports.client = void 0;
const mongodb_1 = require("mongodb");
const mongoUri = process.env.mongoURI || 'mongodb+srv://Julian871:datajulianbase2023@julian871.cehbrfy.mongodb.net/hw3?retryWrites=true&w=majority';
exports.client = new mongodb_1.MongoClient(mongoUri);
exports.db = exports.client.db('hw3');
exports.blogsCollection = exports.db.collection('blogs');
exports.postsCollection = exports.db.collection('posts');
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            yield exports.client.db('blogs').command({ ping: 1 });
            console.log('Connected successful to server');
        }
        catch (_a) {
            console.log('Error connect to server');
            yield exports.client.close();
        }
    });
}
exports.runDb = runDb;
