import { Module } from "@nestjs/common";
import { SaQuizController } from "./quiz.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "./quiz.entity";
import {
  ClearAllQuestionsUseCase, CreateQuestionUseCase,
  DeleteQuestionUseCase,
  FindAllQuestionsUseCase,
  FindOneQuestionUseCase,
  PublishQuestionUseCase, UpdateQuestionUseCase
} from "./quiz.service";
import { QuizzesRepository } from "./quiz.repository";
import { CqrsModule } from "@nestjs/cqrs";


const useCases = [
  ClearAllQuestionsUseCase,
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  UpdateQuestionUseCase,
  FindOneQuestionUseCase,
  FindAllQuestionsUseCase,
  PublishQuestionUseCase
];

@Module({
  imports: [TypeOrmModule.forFeature([Quiz]),CqrsModule],
  controllers: [SaQuizController],
  providers: [...useCases, QuizzesRepository]
})
export class QuizModule {
}
