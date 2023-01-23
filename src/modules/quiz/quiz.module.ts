import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SaQuizController } from './quiz.controller';

@Module({
  controllers: [SaQuizController],
  providers: [QuizService]
})
export class QuizModule {}
