import { Brackets, Repository } from "typeorm";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AnswerStatus, Game, StatusGame } from "./game.entity";
import dateAt from "../../utils/DateGenerator";
import { CommandBus } from "@nestjs/cqrs";
import { Get5QuestionsCommand } from "../quiz/quiz.service";
import { AnswerViewDto } from "./dto/answer-view.dto";
import { AnswerDto } from "./dto/game-pair-view.dto";
import e from "express";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { Quiz } from "../quiz/quiz.entity";


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

  async sendAnswer(userId: string, answer: string): Promise<AnswerViewDto | null> {

    const game = await this.gamesRepository.createQueryBuilder("g")
      .where("g.status = :status", { status: StatusGame.Active })
      .andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
      .getOne();
    if (!game) {
      return null;
    }


    const answerDto = new AnswerDto();
    answerDto.addedAt = dateAt();

    const countQuestions = game.questions.length; // 5

    if (userId === game.firstPlayerId) {

      if (game.firstPlayerAnswers.length === countQuestions) {
        return null;
      }

      const question = game.questions[game.firstPlayerAnswers.length];
      answerDto.questionId = question.id;
      if (question.correctAnswers.includes(answer)) {
        answerDto.answerStatus = AnswerStatus.Correct;
        game.firstPlayerScore += 1;
      } else {
        answerDto.answerStatus = AnswerStatus.Incorrect;
      }
      game.firstPlayerAnswers.push(answerDto);

      if (game.firstPlayerAnswers.length === countQuestions && game.secondPlayerAnswers.length < countQuestions && game.firstPlayerScore > 0) {
        game.firstPlayerScore += 1;
      }

    } else {

      if (game.secondPlayerAnswers.length === countQuestions) {
        return null;
      }

      const question = game.questions[game.secondPlayerAnswers.length];
      answerDto.questionId = question.id;
      if (question.correctAnswers.includes(answer)) {
        answerDto.answerStatus = AnswerStatus.Correct;
        game.secondPlayerScore += 1;
      } else {
        answerDto.answerStatus = AnswerStatus.Incorrect;
      }
      game.secondPlayerAnswers.push(answerDto);

      if (game.secondPlayerAnswers.length === countQuestions && game.firstPlayerAnswers.length < countQuestions && game.secondPlayerScore > 0) {
        game.secondPlayerScore += 1;
      }

    }

    if ((game.firstPlayerAnswers.length + game.secondPlayerAnswers.length) === 2 * countQuestions) {
      game.status = StatusGame.Finished;
      game.finishGameDate = dateAt();
      if (game.firstPlayerScore > game.secondPlayerScore) {
        game.winnerId = game.firstPlayerId;
      } else {
        game.winnerId = game.secondPlayerId;
      }
    }


    await this.gamesRepository.save(game);
    return answerDto;
  }


  async findAllGamesByUserId(
    userId: string, {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    }: PaginationParams): Promise<PaginatorDto<Game[]>> {

    const QB1 = this.gamesRepository.createQueryBuilder("g");
    const QB2 = this.gamesRepository.createQueryBuilder("g");

    QB2.select("COUNT(*)", "count");

    QB1.where("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId });
    QB2.where("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId });

    if (sortBy === "status") {
      sortBy = "g.status";
    } else {
      sortBy = "g.pairCreatedDate";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    QB1
      .orderBy(sortBy, order)
      .skip(((pageNumber - 1) * pageSize))
      .take(pageSize);

    const items = await QB1.getMany();
    const resultCount = await QB2.getRawOne();
    const totalCount = +resultCount?.count || 0;

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


}