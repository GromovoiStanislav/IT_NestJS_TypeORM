import { CommandBus } from "@nestjs/cqrs";
import { ClearAllUsersCommand } from "../users/users.service";
import { ClearAllBlogsCommand } from "../blogs/blogs.service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClearAllQuestionsCommand } from "../quiz/quiz.service";
import { ClearAllGamesCommand } from "../pair-game-quiz/pair-game-quiz.service";


//////////////////////////////////////////////////////////////////
export class DeleteAllDataCommand {
  constructor() {
  }
}

@CommandHandler(DeleteAllDataCommand)
export class DeleteAllDataUseCase implements ICommandHandler<DeleteAllDataCommand> {
  constructor(private commandBus: CommandBus) {
  }

  async execute(command: DeleteAllDataCommand) {
    await this.commandBus.execute(new ClearAllUsersCommand());
    await this.commandBus.execute(new ClearAllBlogsCommand());

    await this.commandBus.execute(new ClearAllGamesCommand());
    await this.commandBus.execute(new ClearAllQuestionsCommand());
  }
}
