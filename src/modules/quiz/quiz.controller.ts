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

import { InputPublishQuizDto } from "./dto/input-publish-quiz.dto";
import { BaseAuthGuard } from "../../common/guards/base.auth.guard";
import { ViewQuizDto } from "./dto/view-quiz.dto";
import { Pagination } from "../../common/decorators/paginationDecorator";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { CommandBus } from "@nestjs/cqrs";
import {
  DeleteQuestionCommand,
  CreateQuestionCommand,
  UpdateQuestionCommand,
  PublishQuestionCommand, FindAllQuestionsCommand
} from "./quiz.service";
import { InputQuizDto } from "./dto/input-quiz.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";
import {
  ApiBasicAuth, ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from "@nestjs/swagger";
import { APIErrorResult } from "../../common/dto/errors-message.dto";

///////////////////////////////////////////////////////


@ApiBasicAuth()
@ApiTags("QuizQuestions")
@UseGuards(BaseAuthGuard)
@Controller("sa/quiz/questions")
export class SaQuizController {
  constructor(private commandBus: CommandBus) {
  }

  @ApiOperation({ summary: "Create question" })
  @ApiBody({ required: true, type: InputQuizDto })
  @ApiResponse({ status: 201, description: "Created", type: ViewQuizDto })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() inputQuizDto: InputQuizDto): Promise<ViewQuizDto> {
    return this.commandBus.execute(new CreateQuestionCommand(inputQuizDto));
  }



  @ApiOperation({ summary: "Return all questions with pagination an filtering" })
  @ApiQuery({
    name: "sortDirection", type: String, required: false, enum: ["asc", "desc"],
    description: "Default value: desc"
  })
  @ApiQuery({ name: "sortBy", required: false, schema: { default: "createdAt", type: "string" } })
  @ApiQuery({
    name: "pageSize", required: false, schema: { default: 10, type: "integer", format: "int32" },
    description: "pageSize is portions size that should be returned"
  })
  @ApiQuery({
    name: "pageNumber", required: false, schema: { default: 1, type: "integer", format: "int32" },
    description: "pageNumber is number of portions that should be returned"
  })
  @ApiQuery({
    name: "publishedStatus", type: String, required: false, enum: ["all", "published", "notPublished"],
    description: "Default value: all"
  })
  @ApiQuery({ name: "bodySearchTerm", type: String, required: false })
  @ApiExtraModels(PaginatorDto)
  @ApiResponse({
    status: 200, description: "Success",
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatorDto) },
        {
          properties: {
            items: {
              type: "array",
              items: { $ref: getSchemaPath(ViewQuizDto) }
            }
          }
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get()
  async findAllQuestion(@Query() query,
                        @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewQuizDto[]>> {
    const bodySearchTerm = query.bodySearchTerm as string || "";
    const publishedStatus = query.publishedStatus as string || "all";

    return this.commandBus.execute(new FindAllQuestionsCommand(bodySearchTerm.trim(), publishedStatus.trim(), paginationParams));
  }


  @ApiOperation({ summary: "Update question" })
  @ApiBody({ required: true, type: InputQuizDto })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values or property 'correctAnswers' are not passed but property 'published' is true", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(@Param("id") id: string, @Body() inputQuizDto: InputQuizDto) {
    await this.commandBus.execute(new UpdateQuestionCommand(id, inputQuizDto));
  }



  @ApiOperation({ summary: "Publish/unpublish question" })
  @ApiBody({ required: true, type: InputPublishQuizDto })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values or specified question doesn't have correct answers", type: APIErrorResult })
  @Put(":id/publish")
  @HttpCode(HttpStatus.NO_CONTENT)
  async publishQuestion(@Param("id") id: string, @Body() publishQuizDto: InputPublishQuizDto) {
    await this.commandBus.execute(new PublishQuestionCommand(id, publishQuizDto));
  }



  @ApiOperation({ summary: "Delete question" })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param("id") id: string) {
    await this.commandBus.execute(new DeleteQuestionCommand(id));
  }
}
