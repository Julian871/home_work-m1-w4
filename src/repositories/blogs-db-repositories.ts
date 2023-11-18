import {blogTypeInput, blogTypeOutput, blogTypePostPut} from "../db/types/blog-types";
import {BlogsModel, PostModel} from "../db/db";
import {ObjectId} from "mongodb";
import {getBlogsQueryType} from "../db/types/blog-types";
import {getPostsQueryType, postTypeInput} from "../db/types/post-types";
import {getLikeListToPost, getMyStatusToPost} from "../utils/getLikeStatus.utility";

export const blogsRepositories = {
    async getAllBlogs(query: getBlogsQueryType): Promise<blogTypeOutput[]>{

        const blogs = await BlogsModel.find({
        name: {$regex: query.searchNameTerm ? query.searchNameTerm : '', $options: 'i'}
        }).sort({[query.sortBy]: query.sortDirection })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .lean()

        return blogs.map((p) => ({
                    id: p._id.toString(),
                    name: p.name,
                    description: p.description,
                    websiteUrl: p.websiteUrl,
                    createdAt: p.createdAt,
                    isMembership: p.isMembership
        }))
    },

    async countBlogsByName(query: getBlogsQueryType): Promise<number>{
        return BlogsModel.countDocuments({
            name: {$regex: query.searchNameTerm ? query.searchNameTerm : '', $options: 'i'}
        });
    },

    async countBlogsByBlogId(blogId: string): Promise<number>{
        const _blogId = new ObjectId(blogId).toString()
        return PostModel.countDocuments({
            blogId: {$regex: _blogId ? _blogId : '', $options: 'i'}
        })
    },



    async getBlogById(id: string): Promise<blogTypeOutput | null> {
        const _id = new ObjectId(id)
        const blog: blogTypeInput | null = await BlogsModel.findOne({_id: _id})
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },

    async getPostByBlogId(query: getPostsQueryType, blogId: string, userId: string) {
        const _blogId = new ObjectId(blogId).toString()

        const posts = await PostModel.find({
            blogId: {$regex: _blogId ? _blogId : '', $options: 'i'}
        }).sort({[query.sortBy]: query.sortDirection })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(+query.pageSize)
            .lean()

        return Promise.all(posts.map(async (p) => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt,
            extendedLikesInfo: {
                likesCount: p.extendedLikesInfo.countLike,
                dislikesCount: p.extendedLikesInfo.countDislike,
                myStatus: await getMyStatusToPost(p._id.toString(), userId),
                newestLikes: await getLikeListToPost(p._id.toString())
            }
        })))
    },



    async createNewBlog(newBlog: blogTypeInput): Promise<blogTypeOutput> {

        await BlogsModel.insertMany(newBlog)
        return {
            id: newBlog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },

    async createNewPostByBlogId(blogId: string, newPost: postTypeInput) {
        const _blogId = new ObjectId(blogId)
        const checkBlogId = await BlogsModel.findOne({_id: _blogId})

        if (!checkBlogId) {
            return false
        }

        await PostModel.insertMany(newPost)
        return  {
            id: newPost._id.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
            extendedLikesInfo: {
                likesCount: newPost.extendedLikesInfo.countLike,
                dislikesCount: newPost.extendedLikesInfo.countDislike,
                myStatus: 'None',
                newestLikes: await getLikeListToPost(newPost._id.toString())
            }
        }
    },

    async updateBlogById(id: string, data: blogTypePostPut): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await BlogsModel.updateOne({_id: _id}, {
            $set: {
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
                }
        })
        return result.matchedCount === 1
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const _id = new ObjectId(id)
        const result = await BlogsModel.deleteOne({_id: _id})
        return result.deletedCount === 1
    }
}