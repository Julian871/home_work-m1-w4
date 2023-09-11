import {blogTypeInput, blogTypeOutput, blogTypePostPut, getBlogsQueryType} from "../db/types/blog-types";
import {blogsRepositories} from "../repositories/blogs-db-reposetories";
import {ObjectId} from "mongodb";
import {blogsCollection, postsCollection} from "../db/db";
import {getPostsQueryType, postTypeInput, postTypePostPut} from "../db/types/post-types";
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "../utils/default-param";

export const blogsService = {
    async getAllBlogs(query: getBlogsQueryType): Promise<blogTypeOutput[]>{

        const blogs = await blogsCollection.find({
            name: {$regex: query.searchNameTerm ? query.searchNameTerm : '', $options: 'i'}
        }).sort({[query.sortBy]: query.sortDirection })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .toArray()

        return await blogsRepositories.getAllBlogs(blogs)

    },



    async getBlogById(id: string): Promise<blogTypeInput | null> {
        return await blogsRepositories.getBlogById(id)
    },


    async getPostByBlogId(blogId: string, query: getPostsQueryType, ) {
        const _blogId = new ObjectId(blogId).toString()
        const postsCount = await postsCollection.countDocuments({
            blogId: {$regex: _blogId ? _blogId : '', $options: 'i'}
        })

        const posts = await postsCollection.find({
            blogId: {$regex: _blogId ? _blogId : '', $options: 'i'}
        }).sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .toArray()



        const foundPosts = await blogsRepositories.getPostByBlogId(posts)
        return {

            pagesCount: Math.ceil(postsCount / (+query.pageSize | DEFAULT_PAGE_SIZE)),
            page: +query.pageNumber | DEFAULT_PAGE_NUMBER,
            pageSize: +query.pageSize | DEFAULT_PAGE_SIZE,
            totalCount: postsCount,
            items: foundPosts
        }

    },

    async createNewBlog(data: blogTypePostPut): Promise<blogTypeInput> {
        const newBlog: blogTypeInput = {
            _id: new ObjectId(),
            ...data,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        return await blogsRepositories.createNewBlog(newBlog)

    },

    async createNewPostByBlogId(blogId: string, data: postTypePostPut) {
        const _blogId = new ObjectId(blogId)
        const checkBlogId = await blogsCollection.findOne({_id: _blogId})

        if (!checkBlogId) {
            return false
        } else {
            const newPost: postTypeInput = {
                _id: new ObjectId(),
                ...data,
                blogId: _blogId.toString(),
                blogName: (Math.random()*100).toString(),
                createdAt: new Date().toISOString()
            }
            return await blogsRepositories.createNewPostByBlogId(newPost)
        }
    },

    async updateBlogById(id: string, data: blogTypePostPut): Promise<boolean> {
        return await blogsRepositories.updateBlogById(id, data)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepositories.deleteBlogById(id)
    }
}