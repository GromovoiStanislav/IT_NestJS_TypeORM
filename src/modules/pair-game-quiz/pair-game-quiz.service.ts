import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairGameQuizRepository } from "./pair-gaim-quiz.repository";
import { GetUserByIdCommand } from "../users/users.service";
import { GamePairViewDto } from "./dto/game-pair-view.dto";
import GameMapper from "./dto/gameMapper";
import { AnswerViewDto } from "./dto/answer-view.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";


@Injectable()
export class PairGameQuizService {
  constructor(private commandBus: CommandBus,
              protected gamesRepository: PairGameQuizRepository) {
  }

  async connectGame(userId: string): Promise<GamePairViewDto> {
    const game = await this.gamesRepository.findNotFinishGameByUserId(userId);
    if (game) {
      throw new ForbiddenException();
    }

    const user = await this.commandBus.execute(new GetUserByIdCommand(userId));
    return GameMapper.fromModelToView(await this.gamesRepository.connectGame(userId, user.login));
  }

  async findGameById(gameId: string, userId: string): Promise<GamePairViewDto> {
    const game = await this.gamesRepository.findGameById(gameId);
    if (!game) {
      throw new NotFoundException();
    }
    if (userId !== game.firstPlayerId && userId !== game.secondPlayerId) {
      throw new ForbiddenException();
    }
    return GameMapper.fromModelToView(game);
  }


  async findCurrentGameByUserId(userId: string): Promise<GamePairViewDto> {
    const game = await this.gamesRepository.findNotFinishGameByUserId(userId);
    if (!game) {
      throw new NotFoundException();
    }
    return GameMapper.fromModelToView(game);
  }

  async findAllGamesByUserId(userId: string, paginationParams: PaginationParams): Promise<PaginatorDto<GamePairViewDto[]>> {
    const result = await this.gamesRepository.findAllGamesByUserId(userId, paginationParams);
    return GameMapper.fromModelsToPaginator(result);
  }


  async sendAnswer(userId: string, answer: string): Promise<AnswerViewDto> {
    const game = await this.gamesRepository.findActiveGameByUserId(userId);
    if (!game) {
      throw new ForbiddenException();
    }
    return await this.gamesRepository.sendAnswer(game, userId, answer);
  }


}


//////////////////////////////////////////////////////////////
export class ClearAllGamesCommand {
  constructor() {
  }
}

@CommandHandler(ClearAllGamesCommand)
export class ClearAllGamesUseCase implements ICommandHandler<ClearAllGamesCommand> {
  constructor(protected gamesRepository: PairGameQuizRepository) {
  }

  async execute(command: ClearAllGamesCommand) {
    await this.gamesRepository.clearAll();
  }
}