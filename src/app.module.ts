import { configModule } from "./config/configModule";

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { TestingModule } from "./modules/testing/testing.module";
import { BlogsModule } from "./modules/blogs/blogs.module";
import { PostsModule } from "./modules/posts/posts.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CqrsModule } from "@nestjs/cqrs";
import { CommentsModule } from "./modules/comments/comments.module";
import { SecurityModule } from "./modules/security/security.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { DatabasePostgresModule } from "./db/postgres.module";
import { QuizModule } from "./modules/quiz/quiz.module";
import { PairGameQuizModule } from "./modules/pair-game-quiz/pair-game-quiz.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path';
import { TelegramAdapter, TelegramHandleUseCase } from "./utils/telegram.adapter";

const useCases = [
  TelegramHandleUseCase,
]

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api',
    }),
    CqrsModule, configModule,
    DatabasePostgresModule,
    UsersModule, TestingModule, BlogsModule, PostsModule, AuthModule, CommentsModule, SecurityModule,
    QuizModule, PairGameQuizModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 500
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TelegramAdapter, ...useCases]
})
export class AppModule {
}
