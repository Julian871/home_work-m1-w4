import 'reflect-metadata'
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./application/blogs-service";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./application/posts-service";
import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./application/users-service";
import {ConnectRepository} from "./repositories/connect-repository";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./application/comments-service";
import {ConnectService} from "./application/connect-service";
import {AuthService} from "./application/auth-service";
import {PostsController} from "./controllers/posts-controller";
import {AuthController} from "./controllers/auth-controllers";
import {BlogsController} from "./controllers/blogs-controller";
import {CommentController} from "./controllers/comment-controller";
import {DeviceController} from "./controllers/device-controller";
import {UsersController} from "./controllers/users-controller";
import {Container} from "inversify";

//Blog
const blogsRepository = new BlogsRepository()
export const blogsService = new BlogsService(blogsRepository)

//Post
const postsRepository = new PostsRepository()
export const postsService = new PostsService(postsRepository)

//User
const connectRepository = new ConnectRepository()
const usersRepository = new UsersRepository()
export const usersService = new UsersService(usersRepository, connectRepository)

//Comment
const commentRepository = new CommentsRepository()
export const commentService = new CommentsService(commentRepository)

//Auth
export const authService = new AuthService(usersRepository, connectRepository)


export const container = new Container()

//Users
container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)

//Auth
container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)

//Blogs
container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)

//Comment
container.bind(CommentController).to(CommentController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)

//Device
container.bind(DeviceController).to(DeviceController)

//Posts
container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepository).to(PostsRepository)

//Connect
container.bind(ConnectService).to(ConnectService)
container.bind(ConnectRepository).to(ConnectRepository)
