import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { QuizzesRepository } from "./quiz.repository";
import { InputQuizDto } from "./dto/input-quiz.dto";
import QuizMapper from "./dto/quizMapper";
import { ViewQuizDto } from "./dto/view-quiz.dto";
import { Quiz } from "./quiz.entity";
import { PublishQuizDto } from "./dto/publish-quiz.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";


//////////////////////////////////////////////////////////////
export class ClearAllQuestionsCommand {
  constructor() {
  }
}

@CommandHandler(ClearAllQuestionsCommand)
export class ClearAllQuestionsUseCase implements ICommandHandler<ClearAllQuestionsCommand> {
  constructor(protected quizzesRepository: QuizzesRepository) {
  }

  async execute(command: ClearAllQuestionsCommand): Promise<void> {
    await this.quizzesRepository.clearAll();
  }
}


////////////////////////////////////////////////////////////
export class DeleteQuestionCommand {
  constructor(public id: string) {
  }
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand> {
  constructor(protected quizzesRepository: QuizzesRepository) {
  }

  async execute(command: DeleteQuestionCommand): Promise<void> {
    const result = await this.quizzesRepository.deleteQuiz(command.id);
    if (!result) {
      throw new NotFoundException();
    }
  }
}


////////////////////////////////////////////////////////////
export class CreateQuestionCommand {
  constructor(public inputQuiz: InputQuizDto) {
  }
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand> {
  constructor(protected quizzesRepository: QuizzesRepository) {
  }

  async execute(command: CreateQuestionCommand): Promise<ViewQuizDto> {
    const createQuestion = QuizMapper.fromInputToCreate(command.inputQuiz);
    return QuizMapper.fromModelToView(await this.quizzesRepository.createQuiz(createQuestion));
  }
}

////////////////////////////////////////////////////////////
export class FindOneQuestionCommand {
  constructor(public id: string) {
  }
}

@CommandHandler(FindOneQuestionCommand)
export class FindOneQuestionUseCase implements ICommandHandler<FindOneQuestionCommand> {
  constructor(protected quizzesRepository: QuizzesRepository) {
  }

  async execute(command: FindOneQuestionCommand): Promise<Quiz> {
    return await this.quizzesRepository.findQuiz(command.id);
  }
}


////////////////////////////////////////////////////
export class FindAllQuestionsCommand {
  constructor( public bodySearchTerm: string, public publishedStatus: string, public paginationParams: PaginationParams) {
  }
}

@CommandHandler(FindAllQuestionsCommand)
export class FindAllQuestionsUseCase implements ICommandHandler<FindAllQuestionsCommand> {
  constructor(protected quizzesRepository: QuizzesRepository) {
  }

  async execute(command: FindAllQuestionsCommand): Promise<PaginatorDto<ViewQuizDto[]>> {
    const result = await this.quizzesRepository.getAllQuizzes(command.bodySearchTerm, command.publishedStatus, command.paginationParams);
    return QuizMapper.fromModelsToPaginator(result);
  }
}

////////////////////////////////////////////////////////////
export class UpdateQuestionCommand {
  constructor(public id: string, public inputQuiz: InputQuizDto) {
  }
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
  constructor(protected quizzesRepository: QuizzesRepository) {
  }

  async execute(command: UpdateQuestionCommand): Promise<void> {
    // const question = await this.quizzesRepository.findQuiz(command.id);
    // if (!question) {
    //   throw new NotFoundException();
    // }
    const updateQuestion = QuizMapper.fromInputToUpdate(command.inputQuiz);
    const result = await this.quizzesRepository.updateQuiz(command.id, updateQuestion);
    if (!result) {
      throw new NotFoundException();
    }

  }
}

////////////////////////////////////////////////////////////
export class PublishQuestionCommand {
  constructor(public id: string, public publishQuizDto: PublishQuizDto) {
  }
}

@CommandHandler(UpdateQuestionCommand)
export class PublishQuestionUseCase implements ICommandHandler<PublishQuestionCommand> {
  constructor(protected quizzesRepository: QuizzesRepository) {
  }

  async execute(command: PublishQuestionCommand): Promise<void> {
    // const question = await this.quizzesRepository.findQuiz(command.id);
    // if (!question) {
    //   throw new NotFoundException();
    // }
    const result = await this.quizzesRepository.updatePublishQuiz(command.id, command.publishQuizDto);
    if (!result) {
      throw new NotFoundException();
    }

  }
}