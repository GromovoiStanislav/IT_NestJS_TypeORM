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
import { QuizService } from "./quiz.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { PublishQuizDto } from "./dto/publish-quiz.dto";
import { BaseAuthGuard } from "../../guards/base.auth.guard";
import { ViewQuizDto } from "./dto/view-quiz.dto";
import { Pagination } from "../../decorators/paginationDecorator";
import { PaginationParams } from "../../commonDto/paginationParams.dto";

@UseGuards(BaseAuthGuard)
@Controller("sa/quiz/questions")
export class SaQuizController {
  constructor(private readonly quizService: QuizService) {
  }

  @Post()
  createQuestion(@Body() createQuizDto: CreateQuizDto): ViewQuizDto {
    return {
      "body": "stringstri",
      "correctAnswers": [
        "string"
      ]
    };
  }

  @Get()
  findAllQuestion(@Query() query, @Pagination() paginationParams: PaginationParams) {
    const bodySearchTerm = query.bodySearchTerm as string || "";
    const publishedStatus = query.publishedStatus as string || "all";

    return {
      "pagesCount": 0,
      "page": 0,
      "pageSize": 0,
      "totalCount": 0,
      "items": [
        {
          "id": "string",
          "body": "string",
          "correctAnswers": [
            "string"
          ],
          "published": false,
          "createdAt": "2023-01-23T04:57:32.321Z",
          "updatedAt": "2023-01-23T04:57:32.321Z"
        }
      ]
    };


  }


  @Put(":id")
  updateQuestion(@Param("id") id: number, @Body() createQuizDto: CreateQuizDto) {

  }

  @Put(":id/publish")
  publishQuestion(@Param("id") id: number, @Body() publishQuizDto: PublishQuizDto) {

  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteQuestion(@Param("id") id: number) {
  }
}
