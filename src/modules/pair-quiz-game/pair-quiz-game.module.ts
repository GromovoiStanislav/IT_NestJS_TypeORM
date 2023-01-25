import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { PairQuizGameController } from './pair-quiz-game.controller';
import { UserIdMiddleware } from "../../middlewares/userId.middleware";
import { JWT_Module } from "../jwt/jwt.module";

@Module({
  imports: [TypeOrmModule.forFeature([]), CqrsModule,JWT_Module],
  controllers: [PairQuizGameController]
})
export class PairQuizGameModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes("blogger/blogs");
  }
}
