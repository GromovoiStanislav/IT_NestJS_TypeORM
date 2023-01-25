import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { PairGameQuizController } from './pair-game-quiz.controller';
import { UserIdMiddleware } from "../../middlewares/userId.middleware";
import { JWT_Module } from "../jwt/jwt.module";

@Module({
  imports: [TypeOrmModule.forFeature([]), CqrsModule,JWT_Module],
  controllers: [PairGameQuizController]
})
export class PairGameQuizModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes("pair-game-quiz/pairs");
  }
}
