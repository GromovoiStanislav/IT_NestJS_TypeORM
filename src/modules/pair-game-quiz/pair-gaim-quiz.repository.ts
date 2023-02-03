import { Brackets, DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AnswerStatus, Game, StatusGame } from "./game.entity";
import dateAt from "../../utils/DateGenerator";
import { CommandBus } from "@nestjs/cqrs";
import { Get5QuestionsCommand } from "../quiz/quiz.service";
import { AnswerViewDto } from "./dto/answer-view.dto";
import { AnswerDto } from "./dto/game-pair-view.dto";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";


@Injectable()
export class PairGameQuizRepository {

  constructor(
    private commandBus: CommandBus,
    private readonly dataSource: DataSource,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {

      const game = await manager.getRepository(Game).createQueryBuilder("g")
        .setLock("pessimistic_read")
        .where("g.status = :status", { status: StatusGame.Active })
        .andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
        .getOne();
      if (!game) {
        return null;
      }

      const answerDto = new AnswerDto();
      answerDto.addedAt = dateAt();


      if (userId === game.firstPlayerId) {

        if (game.firstPlayerAnswers.length === 5) {
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

      } else {

        if (game.secondPlayerAnswers.length === 5) {
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

      }

      if ((game.firstPlayerAnswers.length + game.secondPlayerAnswers.length) === 10) {
        game.status = StatusGame.Finished;
        game.finishGameDate = dateAt();


        if ((game.firstPlayerAnswers[4].addedAt < game.secondPlayerAnswers[4].addedAt) && game.firstPlayerScore > 0) {
          game.firstPlayerScore += 1;
        } else if ((game.firstPlayerAnswers[4].addedAt > game.secondPlayerAnswers[4].addedAt) && game.secondPlayerScore > 0) {
          game.secondPlayerScore += 1;
        }


        if (game.firstPlayerScore > game.secondPlayerScore) {
          game.winnerId = game.firstPlayerId;
        } else if (game.firstPlayerScore < game.secondPlayerScore) {
          game.winnerId = game.secondPlayerId;
        }
      }


      await manager.save(game);
      await queryRunner.commitTransaction();
      return answerDto;

    } catch (e) {
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }

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


  async getStatisticByUserId(userId: string): Promise<Game[]> {
    return await this.gamesRepository.createQueryBuilder("g")
      .where("g.status = :status", { status: StatusGame.Finished })
      .andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
      .getMany();
  }

}