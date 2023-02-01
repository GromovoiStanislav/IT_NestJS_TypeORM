import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import {
  ClearAllCommentsUseCase, CreateCommentByPostIDUseCase,
  DeleteCommentUseCase, GetAllCommentsByArrayOfPostIDUseCase, GetAllCommentsByPostIDUseCase,
  GetCommentUseCase,
  UpdateCommentLikeUseCase,
  UpdateCommentUseCase
} from "./comments.service";
import { UserIdMiddleware } from "../../common/middlewares/userId.middleware";
import { CommentsController } from "./comments.controller";
import { JWT_Module } from "../jwt/jwt.module";
import { CommentsRepository } from "./comments.repository";
import { CommentLikesRepository } from "./comment-likes.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./comment.entity";
import { CommentLike } from "./comment-like.entity";

const useCases = [
  ClearAllCommentsUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase,
  UpdateCommentLikeUseCase,
  GetCommentUseCase,
  CreateCommentByPostIDUseCase,
  GetAllCommentsByPostIDUseCase,
  GetAllCommentsByArrayOfPostIDUseCase
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike]),
    CqrsModule,
    JWT_Module
  ],
  controllers: [CommentsController],
  providers: [...useCases, CommentsRepository, CommentLikesRepository]
})

export class CommentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes("comments");
  }
}