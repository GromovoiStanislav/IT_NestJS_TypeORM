import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put, Query
} from "@nestjs/common";

import { PublishQuizDto } from "./dto/publish-quiz.dto";
import { BaseAuthGuard } from "../../guards/base.auth.guard";
import { ViewQuizDto } from "./dto/view-quiz.dto";
import { Pagination } from "../../decorators/paginationDecorator";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { CommandBus } from "@nestjs/cqrs";
import {
  DeleteQuestionCommand,
  CreateQuestionCommand,
  UpdateQuestionCommand,
  PublishQuestionCommand, FindAllQuestionsCommand
} from "./quiz.service";
import { InputQuizDto } from "./dto/input-quiz.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";


///////////////////////////////////////////////////////

@UseGuards(BaseAuthGuard)
@Controller("sa/quiz/questions")
export class SaQuizController {
  constructor(private commandBus: CommandBus) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() inputQuizDto: InputQuizDto): Promise<ViewQuizDto> {
    return this.commandBus.execute(new CreateQuestionCommand(inputQuizDto));
  }

  @Get()
  async findAllQuestion(@Query() query,
                        @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewQuizDto[]>> {
    const bodySearchTerm = query.bodySearchTerm as string || "";
    const publishedStatus = query.publishedStatus as string || "all";

    return this.commandBus.execute(new FindAllQuestionsCommand(bodySearchTerm.trim(), publishedStatus.trim(), paginationParams));
  }


  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(@Param("id") id: string, @Body() inputQuizDto: InputQuizDto) {
    await this.commandBus.execute(new UpdateQuestionCommand(id, inputQuizDto));
  }

  @Put(":id/publish")
  @HttpCode(HttpStatus.NO_CONTENT)
  async publishQuestion(@Param("id") id: string, @Body() publishQuizDto: PublishQuizDto) {
    await this.commandBus.execute(new PublishQuestionCommand(id, publishQuizDto));
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param("id") id: string) {
    await this.commandBus.execute(new DeleteQuestionCommand(id));
  }
}
