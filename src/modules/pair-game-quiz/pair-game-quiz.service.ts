import { Injectable } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PairGameQuizRepository } from "./pair-gaim-quiz.repository";
import { GetUserByIdCommand } from "../users/users.service";


@Injectable()
export class PairGameQuizService {
  constructor(private commandBus: CommandBus,
              protected gamesRepository: PairGameQuizRepository) {
  }

  async connectGame(userId: string): Promise<string> {
    const user = await this.commandBus.execute(new GetUserByIdCommand(userId));
    return this.gamesRepository.connectGame(userId, user.login);
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