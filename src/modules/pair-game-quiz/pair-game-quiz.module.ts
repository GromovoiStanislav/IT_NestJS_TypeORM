import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { PairGameQuizController } from "./pair-game-quiz.controller";
import { UserIdMiddleware } from "../../middlewares/userId.middleware";
import { JWT_Module } from "../jwt/jwt.module";
import { ClearAllGamesUseCase, PairGameQuizService } from "./pair-game-quiz.service";
import { Game } from "./game.entity";
import { PairGameQuizRepository } from "./pair-gaim-quiz.repository";

const useCases = [ClearAllGamesUseCase];


@Module({
  imports: [TypeOrmModule.forFeature([Game]), CqrsModule, JWT_Module],
  controllers: [PairGameQuizController],
  providers: [...useCases, PairGameQuizService, PairGameQuizRepository]
})
export class PairGameQuizModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes("pair-game-quiz/pairs");
  }
}
