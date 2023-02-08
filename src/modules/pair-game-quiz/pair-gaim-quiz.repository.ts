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
import { StatisticViewDto } from "./dto/statistic-view.dto";
import { TopGamePlayerDbDto } from "./dto/top-game-view.dto";


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
      // .where("g.status = :status", { status: StatusGame.Active })
      // .andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
      .where([
        { firstPlayerId: userId, status: StatusGame.Active },
        { secondPlayerId: userId, status: StatusGame.Active }
      ])
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
      // .where("(g.status = :status1 or g.status = :status2)", {
      //   status1: StatusGame.PendingSecondPlayer,
      //   status2: StatusGame.Active
      // })
      .where([
        { status: StatusGame.PendingSecondPlayer },
        { status: StatusGame.Active }
      ])
      //.andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
      .andWhere([
        { firstPlayerId: userId },
        { secondPlayerId: userId }
      ])
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
        .setLock("pessimistic_write")
        // .where("g.status = :status", { status: StatusGame.Active })
        // .andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
        .where([
          { firstPlayerId: userId, status: StatusGame.Active },
          { secondPlayerId: userId, status: StatusGame.Active }
        ])
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

    // QB1.where("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId });
    // QB2.where("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId });

    QB1.where([
      { firstPlayerId: userId },
      { secondPlayerId: userId }
    ]);
    QB2.where([
      { firstPlayerId: userId },
      { secondPlayerId: userId }
    ]);

    const order = sortDirection === "asc" ? "ASC" : "DESC";

    if (sortBy === "status") {
      QB1
        .orderBy("g.status", order)
        .addOrderBy("g.pairCreatedDate", "DESC");
    } else {
      QB1.orderBy("g.pairCreatedDate", order);
    }


    QB1
      .skip(((pageNumber - 1) * pageSize))
      .take(pageSize);

    const items = await QB1.getMany();
    const resultCount = await QB2.getRawOne();
    const totalCount = +resultCount?.count || 0;

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


  //: Promise<Game[]>
  async getStatisticByUserId(userId: string): Promise<StatisticViewDto> {
    // return await this.gamesRepository.createQueryBuilder("g")
    //   // .where("g.status = :status", { status: StatusGame.Finished })
    //   // .andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
    //   .where([
    //     { firstPlayerId: userId, status: StatusGame.Finished },
    //     { secondPlayerId: userId, status: StatusGame.Finished }
    //   ])
    //   .getMany();
    //

    try {

      const result = await this.dataSource.query(`
      SELECT
      ROUND(("sumScore"::numeric/"gamesCount"::numeric), 2)::float8 as "avgScores",
      "gamesCount","sumScore",
      "winsCount","lossesCount","drawsCount"   
      FROM
        (SELECT
          (SELECT  count(*)
            FROM public.games
            WHERE ("firstPlayerId"=$1 or "secondPlayerId"=$1) and "status" = $2)::int as "gamesCount",
            
            (SELECT sq."sumScore1"+sq."sumScore2"
              FROM
              (SELECT
                (SELECT  sum("firstPlayerScore")
                  FROM public.games
                  WHERE ("firstPlayerId"=$1) and "status" = $2) as "sumScore1",
                (SELECT  sum("secondPlayerScore")
                  FROM public.games
                  WHERE ("secondPlayerId"=$1) and "status" = $2) as "sumScore2") as sq)::int as "sumScore",
            
            (SELECT  count(*)
              FROM public.games
              WHERE "status" = $2 and "winnerId"=$1)::int as "winsCount",
            
            (SELECT  count(*)
              FROM public.games
              WHERE ("firstPlayerId"=$1 or "secondPlayerId"=$1) and "status" = $2 and "winnerId"<>$1)::int as "lossesCount",
              
            (SELECT  count(*)
              FROM public.games
              WHERE ("firstPlayerId"=$1 or "secondPlayerId"=$1) and "status" = $2 and "winnerId" isNull)::int as "drawsCount") as sq
      ;`, [userId, StatusGame.Finished]);

      return result[0];


    } catch (e) {
      return {
        sumScore: 0,
        avgScores: 0,
        gamesCount: 0,
        winsCount: 0,
        lossesCount: 0,
        drawsCount: 0
      };
    }
  }

  /*
  SELECT
ROUND(("sumScore"::numeric/"gamesCount"::numeric), 2) as "avgScores",
"gamesCount","sumScore",
"winsCount","lossesCount","drawsCount"

FROM
(SELECT
(SELECT  count(*)
	FROM public.games
	WHERE ("firstPlayerId"='1675743082625' or "secondPlayerId"='1675743082625') and "status" = 'Finished') as "gamesCount",

(SELECT sq."sumScore1"+sq."sumScore2"
	FROM
	(SELECT
		(SELECT  sum("firstPlayerScore")
		FROM public.games
		WHERE ("firstPlayerId"='1675743082625') and "status" = 'Finished') as "sumScore1",
	(SELECT  sum("secondPlayerScore")
		FROM public.games
		WHERE ("secondPlayerId"='1675743082625') and "status" = 'Finished') as "sumScore2") as sq) as "sumScore",

(SELECT  count(*)
	FROM public.games
	WHERE "status" = 'Finished' and "winnerId"='1675743082625') as "winsCount",

(SELECT  count(*)
	FROM public.games
	WHERE ("firstPlayerId"='1675743082625' or "secondPlayerId"='1675743082625') and "status" = 'Finished' and "winnerId"<>'1675743082625') as "lossesCount",

(SELECT  count(*)
	FROM public.games
	WHERE ("firstPlayerId"='1675743082625' or "secondPlayerId"='1675743082625') and "status" = 'Finished' and "winnerId" isNull) as "drawsCount")as sq
;
  */

  async getUsersTop({
                      pageNumber,
                      pageSize,
                      sort
                    }: PaginationParams): Promise<PaginatorDto<TopGamePlayerDbDto[]>> {

    try {

      let query = `
      SELECT "userId",u."login" as "userLogin","gamesCount","sumScore","avgScores","winsCount","lossesCount","drawsCount"
      FROM
      (SELECT "userId",
        SUM("gamesCount")::int AS "gamesCount",
        SUM("sumScore")::int AS "sumScore",
        ROUND(SUM("sumScore")/SUM("gamesCount"),2)::float8 AS "avgScores",
        SUM("winsCount")::int AS "winsCount",
        SUM("lossesCount")::int AS "lossesCount",
        SUM("drawsCount")::int AS "drawsCount"
      FROM
        (SELECT "firstPlayerId" AS "userId",
            SUM("firstPlayerScore") AS "sumScore",
            COUNT(*) AS "gamesCount",
            0 AS "winsCount",
            0 AS "lossesCount",
            0 AS "drawsCount"
        FROM PUBLIC.GAMES
        WHERE "status" = 'Finished'
        GROUP BY "firstPlayerId"
      
        UNION ALL 
      
        SELECT "secondPlayerId" AS "userId",
            SUM("secondPlayerScore") AS "sumScore",
            COUNT(*) AS "gamesCount",
            0 AS "winsCount",
            0 AS "lossesCount",
            0 AS "drawsCount"
        FROM PUBLIC.GAMES
        WHERE "status" = 'Finished'
        GROUP BY "secondPlayerId"
     
        UNION ALL 
      
        SELECT "userId" AS "userId",
            0 as "gamesCount",
            0 as "sumScore",
            SUM("winsCount") AS "winsCount",
            SUM("lossesCount") AS "lossesCount",
            SUM("drawsCount") AS "drawsCount"
        FROM
        (SELECT "firstPlayerId" AS "userId",
            CASE
                WHEN "firstPlayerScore" > "secondPlayerScore" THEN 1
                ELSE 0
            END AS "winsCount",
            CASE
                WHEN "firstPlayerScore" < "secondPlayerScore" THEN 1
                ELSE 0
            END AS "lossesCount",
            CASE
                WHEN "firstPlayerScore" = "secondPlayerScore" THEN 1
                ELSE 0
            END AS "drawsCount"
        FROM PUBLIC.GAMES
        WHERE "status" = 'Finished') AS SQ
        GROUP BY "userId"
        
      UNION ALL 
      
        SELECT "userId" AS "userId",
            0 as "gamesCount",
            0 as "sumScore",
            SUM("winsCount") AS "winsCount",
            SUM("lossesCount") AS "lossesCount",
            SUM("drawsCount") AS "drawsCount"
        FROM
        (SELECT "secondPlayerId" AS "userId",
            CASE
                WHEN "firstPlayerScore" < "secondPlayerScore" THEN 1
                ELSE 0
            END AS "winsCount",
            CASE
                WHEN "firstPlayerScore" > "secondPlayerScore" THEN 1
                ELSE 0
            END AS "lossesCount",
            CASE
                WHEN "firstPlayerScore" = "secondPlayerScore" THEN 1
                ELSE 0
            END AS "drawsCount"
        FROM PUBLIC.GAMES
        WHERE "status" = 'Finished') AS SQ
        GROUP BY "userId") AS SQ
      GROUP BY "userId") AS SQ
      
      LEFT JOIN PUBLIC.USERS as u
        ON SQ."userId"=u."id"
      
      `;


      let sortBy = "";
      sort.forEach(el => {
        if (["avgScores", "sumScore", "userId", "userLogin", "gamesCount", "sumScore", "avgScores", "winsCount", "lossesCount", "drawsCount"].includes(el.sortBy)) {
          sortBy += `"${el.sortBy}" ${el.sortDirection}, `;
        }
      });
      if (sortBy) {
        query += `ORDER BY ${sortBy.slice(0, -2)}`;
      } else {
        query += `ORDER BY "avgScores" DESC, "sumScore" DESC`;
      }


      const items = await this.dataSource.query(query);
      const resultCount = await this.dataSource.query(`
        SELECT "firstPlayerId"
        FROM public.games
	      WHERE status='Finished'
	      UNION
	      SELECT "secondPlayerId"
        FROM public.games
	      WHERE status='Finished';
      `);

      const totalCount = resultCount.length;
      const pagesCount = Math.ceil(totalCount / pageSize);
      const page = pageNumber;

      return { pagesCount, page, pageSize, totalCount, items };

    } catch (e) {
      return { pagesCount: 0, page: 0, pageSize: 0, totalCount: 0, items: [] };
    }


  }

}