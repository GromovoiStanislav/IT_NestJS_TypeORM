import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game, StatusGame } from "./game.entity";
import dateAt from "../../utils/DateGenerator";


@Injectable()
export class PairGameQuizRepository {

  constructor(
    @InjectRepository(Game) private gamesRepository: Repository<Game>
  ) {
  }


  async clearAll(): Promise<void> {
    await this.gamesRepository.delete({});
  }

  async connectGame(userId: string, login: string): Promise<string> {

    let game;

    ///получим игру с status=PendingSecondPlayer иначе создадим новую игру
    game = await this.gamesRepository.findOneBy({ status: StatusGame.PendingSecondPlayer });
    if (game) {
      game.secondPlayerId = userId;
      game.firstPlayerLogin = login;
      game.startGameDate = dateAt();
      game.status = StatusGame.Active

      await this.gamesRepository.save(game);
    } else {

      game = new Game();
      game.firstPlayerId = userId;
      game.firstPlayerLogin = login;

      game.pairCreatedDate = dateAt();


      await this.gamesRepository.save(game);
    }


    return game.id;
  }


}