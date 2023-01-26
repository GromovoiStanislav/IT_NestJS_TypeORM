import { Brackets, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AnswerStatus, Game, StatusGame } from "./game.entity";
import dateAt from "../../utils/DateGenerator";
import { CommandBus } from "@nestjs/cqrs";
import { Get5QuestionsCommand } from "../quiz/quiz.service";
import { AnswerViewDto } from "./dto/answer-view.dto";
import { AnswerDto } from "./dto/game-pair-view.dto";
import e from "express";


@Injectable()
export class PairGameQuizRepository {

  constructor(
    private commandBus: CommandBus,
    @InjectRepository(Game) private gamesRepository: Repository<Game>
  ) {
  }


  async clearAll(): Promise<void> {
    await this.gamesRepository.delete({});
  }

  async findGameById(id: string): Promise<Game | null> {
    return this.gamesRepository.findOneBy({ id });
  }

  async findActiveGameByUserId(userId: string): Promise<Game | null> {
    return this.gamesRepository.createQueryBuilder("g")
      .where("g.status = :status", { status: StatusGame.Active })
      .andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
      // .andWhere(
      //   new Brackets((qb) => {
      //     qb.where("g.firstPlayerId = :userId", { userId })
      //       .orWhere("g.secondPlayerId = :userId", { userId });
      //   })
      //)
      .getOne();
  }


  async findNotFinishGameByUserId(userId: string): Promise<Game | null> {
    return this.gamesRepository.createQueryBuilder("g")
      .where("(g.status = :status1 or g.status = :status2)", {
        status1: StatusGame.PendingSecondPlayer,
        status2: StatusGame.Active
      })
      .andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
      .getOne();
  }


  async connectGame(userId: string, login: string): Promise<Game> {
    let game = await this.gamesRepository.findOneBy({ status: StatusGame.PendingSecondPlayer });
    if (game) {
      game.secondPlayerId = userId;
      game.secondPlayerLogin = login;
      game.startGameDate = dateAt();
      game.status = StatusGame.Active;
      game.questions = await this.commandBus.execute(new Get5QuestionsCommand());
      await this.gamesRepository.save(game);
    } else {
      game = new Game();
      game.firstPlayerId = userId;
      game.firstPlayerLogin = login;
      game.pairCreatedDate = dateAt();
      await this.gamesRepository.save(game);
    }
    return game;
  }

  async sendAnswer(game: Game, userId: string, answer: string): Promise<AnswerViewDto> {

    const answerDto = new AnswerDto();
    answerDto.addedAt = dateAt();

    if (userId === game.firstPlayerId) {

      const question = game.questions[game.firstPlayerAnswers.length];
      answerDto.questionId = question.id;
      if (question.correctAnswers.includes(answer)) {
        answerDto.answerStatus = AnswerStatus.Correct;
        game.firstPlayerScore += 1;
      } else {
        answerDto.answerStatus = AnswerStatus.Incorrect;
      }
      game.firstPlayerAnswers.push(answerDto);

      if (game.firstPlayerAnswers.length === 5 && game.secondPlayerAnswers.length < 5 && game.firstPlayerScore > 0) {
        game.firstPlayerScore += 1;
      }

    } else {

      const question = game.questions[game.secondPlayerAnswers.length];
      answerDto.questionId = question.id;
      if (question.correctAnswers.includes(answer)) {
        answerDto.answerStatus = AnswerStatus.Correct;
        game.secondPlayerScore += 1;
      } else {
        answerDto.answerStatus = AnswerStatus.Incorrect;
      }
      game.secondPlayerAnswers.push(answerDto);

      if (game.secondPlayerAnswers.length === 5 && game.firstPlayerAnswers.length < 5 && game.secondPlayerScore > 0) {
        game.secondPlayerScore += 1;
      }

    }

    if ((game.firstPlayerAnswers.length + game.secondPlayerAnswers.length) === 10) {
      game.status = StatusGame.Finished;
      game.finishGameDate = dateAt();
    }


    await this.gamesRepository.save(game);
    return answerDto;
  }


}