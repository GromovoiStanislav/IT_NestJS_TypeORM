import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import {
  ClearAllPostsUseCase,
  CreatePostByBlogIdUseCase,
  CreatePostUseCase,
  DeletePostByBlogIdAndPostIdUseCase,
  DeletePostUseCase,
  GetAllPostsByBlogIdUseCase,
  GetAllPostsByBlogOwnerIdUseCase,
  GetAllPostsUseCase,
  GetOnePostUseCase,
  GetOnePostWithLikesUseCase,
  PostsUpdateLikeByIDUseCase,
  UpdatePostByBlogIdAndPostIdUseCase,
  UpdatePostUseCase
} from "./posts.service";
import { CqrsModule } from "@nestjs/cqrs";
import { UserIdMiddleware } from "../../middlewares/userId.middleware";
import { JWT_Module } from "../jwt/jwt.module";
import { BlogIdValidator } from "./dto/blogId.validator";
import { PostsRepository } from "./posts.repository";
import { PostLikesRepository } from "./post-likes.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { PostLike } from "./post-like.entity";


const useCases = [
  ClearAllPostsUseCase,
  DeletePostUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  GetOnePostUseCase,
  GetOnePostWithLikesUseCase,
  GetAllPostsUseCase,
  GetAllPostsByBlogIdUseCase,
  CreatePostByBlogIdUseCase,
  PostsUpdateLikeByIDUseCase,
  DeletePostByBlogIdAndPostIdUseCase,
  UpdatePostByBlogIdAndPostIdUseCase,
  GetAllPostsByBlogOwnerIdUseCase,
];

@Module({
  imports: [CqrsModule, JWT_Module, TypeOrmModule.forFeature([Post, PostLike])],
  controllers: [PostsController],
  providers: [...useCases, PostsRepository, PostLikesRepository, BlogIdValidator],
  exports: []
})

export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes("posts");
  }
}