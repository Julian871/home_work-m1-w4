import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./routers/blogs-routers";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./routers/post-routers";
import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./routers/users-routers";
import {ConnectRepository} from "./repositories/connect-repository";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentController} from "./routers/comments-routers";
import {connectService} from "./domain/connect-service";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./routers/auth-routers";
import {DeviceController} from "./routers/device-routers";

//Blog
const blogsRepository = new BlogsRepository()
export const blogsService = new BlogsService(blogsRepository)
export const blogsController = new BlogsController(blogsService)

//Post
const postsRepository = new PostsRepository()
export const postsService = new PostsService(postsRepository)
export const postsController = new PostsController(postsService)

//User
const connectRepository = new ConnectRepository()
const usersRepository = new UsersRepository()
export const usersService = new UsersService(usersRepository, connectRepository)
export const usersController = new UsersController(usersService)

//Comment
const commentRepository = new CommentsRepository()
export const commentService = new CommentsService(commentRepository)
export const commentController = new CommentController(commentService)

//Auth
export const authService = new AuthService(usersRepository, connectRepository)
export const authController = new AuthController(authService, usersService, connectService)

//Device
export const deviceController = new DeviceController(connectService)

