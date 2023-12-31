import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogCreator, BlogInfo, blogTypeOutput, blogTypePostPut, getBlogsQueryType} from "../db/types/blog-types";
import {getPostsQueryType, PostCreator, PostInfo, postTypePostPut} from "../db/types/post-types";
import {headTypes, PageInfo} from "../db/types/head-types";
import {getLikeListToPost, getMyStatusToPost} from "../utils/getLikeStatus.utility";
import {injectable} from "inversify";


@injectable()
export class BlogsService {
    constructor(protected blogsRepositories: BlogsRepository) {}

    async getAllBlogs(query: getBlogsQueryType): Promise<headTypes> {
        const blogsCount = await this.blogsRepositories.countBlogsByName(query)
        const allBlogs = await this.blogsRepositories.getAllBlogs(query)
        const filterBlogs = allBlogs.map((p) => (
            new BlogInfo(p._id.toString(), p.name, p.description, p.websiteUrl, p.createdAt, p.isMembership)
        ))
        return new PageInfo(query.pageNumber, query.pageSize, blogsCount, filterBlogs)
    }

    async getBlogById(id: string): Promise<blogTypeOutput | null> {
        const blog = await this.blogsRepositories.getBlogById(id)
        if (!blog) return null
        return new BlogInfo(blog._id.toString(), blog.name, blog.description, blog.websiteUrl, blog.createdAt, blog.isMembership)
    }

    async getPostByBlogId(query: getPostsQueryType, blogId: string, userId: string) {
        const allPosts = await this.blogsRepositories.getPostByBlogId(query, blogId)
        const countPost = await this.blogsRepositories.countBlogsByBlogId(blogId)
        const filterPostsByBlogId = await Promise.all(allPosts.map(async (p) => (
            new PostInfo(p._id.toString(), p.title, p.shortDescription, p.content, blogId, p.blogName, p.createdAt,
                p.extendedLikesInfo.countLike, p.extendedLikesInfo.countDislike,
                await getMyStatusToPost(p._id.toString(), userId),
                await getLikeListToPost(p._id.toString())
            ))))
        return new PageInfo(query.pageNumber, query.pageSize, countPost, filterPostsByBlogId)
    }

    async createNewBlog(data: blogTypePostPut): Promise<blogTypeOutput> {
        const newBlog = new BlogCreator(data.name, data.description, data.websiteUrl)
        await this.blogsRepositories.createNewBlog(newBlog)
        return new BlogInfo(newBlog._id.toString(), newBlog.name, newBlog.description, newBlog.websiteUrl, newBlog.createdAt, newBlog.isMembership)
    }

    async createNewPostByBlogId(blogId: string, data: postTypePostPut) {
        const blog = await this.blogsRepositories.getBlogById(blogId)
        if (!blog) return false

        const newPost = new PostCreator(data.title, data.shortDescription, data.content, blogId)
        await this.blogsRepositories.createNewPostByBlogId(newPost)
        return new PostInfo(newPost._id.toString(), newPost.title, newPost.shortDescription, newPost.content,
            newPost.blogId, newPost.blogName, newPost.createdAt, 0, 0, 'None', [])
    }

    async updateBlogById(id: string, data: blogTypePostPut): Promise<boolean> {
        return await this.blogsRepositories.updateBlogById(id, data)
    }

    async deleteBlogById(id: string): Promise<boolean> {
        return await this.blogsRepositories.deleteBlogById(id)
    }
}