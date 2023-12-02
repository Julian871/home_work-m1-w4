import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./domain/users-service";
import {ConnectRepository} from "./repositories/connect-repository";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {connectService} from "./domain/connect-service";
import {AuthService} from "./domain/auth-service";
import {PostsController} from "./controllers/posts-controller";
import {AuthController} from "./controllers/auth-controllers";
import {BlogsController} from "./controllers/blogs-controller";
import {CommentController} from "./controllers/comment-controller";
import {DeviceController} from "./controllers/device-controller";
import {UsersController} from "./controllers/users-controller";

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

