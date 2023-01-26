import { AnswerStatus } from "../game.entity";

export class GamePairViewDto {
  id: string;
  firstPlayerProgress: PlayerProgressDto;
  secondPlayerProgress: PlayerProgressDto;
  questions: QuestionDto[];
  status: string;
  pairCreatedDate: string;
  startGameDate: string;
  finishGameDate: string;
}

export class PlayerProgressDto {
  answers: AnswerDto[];
  player: PlayerDto;
  score: number;
}

export class AnswerDto {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: string;
}

export class QuestionDto {
  id: string;
  body: string;
}

export class PlayerDto {
  id: string;
  login: string;
}