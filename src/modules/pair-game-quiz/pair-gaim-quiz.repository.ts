import { Brackets, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game, StatusGame } from "./game.entity";
import dateAt from "../../utils/DateGenerator";
import { CommandBus } from "@nestjs/cqrs";
import { Get5QuestionsCommand } from "../quiz/quiz.service";


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
      //.andWhere("(g.firstPlayerId = :userId or g.secondPlayerId = :userId)", { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where("g.firstPlayerId = :userId", { userId })
            .orWhere("g.secondPlayerId = :userId", { userId });
        })
      )
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


}