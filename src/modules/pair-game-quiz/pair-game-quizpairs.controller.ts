import {
  BadRequestException, Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards
} from "@nestjs/common";
import { AuthUserIdGuard } from "../../common/guards/auth.userId.guard";
import { CurrentUserId } from "../../common/decorators/current-userId.decorator";
import { PairGameQuizService } from "./pair-game-quiz.service";
import { InputAnswerDto } from "./dto/input-answer.dto";
import { GamePairViewDto } from "./dto/game-pair-view.dto";
import { AnswerViewDto } from "./dto/answer-view.dto";
import { Pagination } from "../../common/decorators/paginationDecorator";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation, ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from "@nestjs/swagger";
import { StatisticViewDto } from "./dto/statistic-view.dto";
import { APIErrorResult } from "../../common/dto/errors-message.dto";
import { ViewQuizDto } from "../quiz/dto/view-quiz.dto";


//////////////////////////////////////////////
@ApiTags("PairQuizGame")
@ApiBearerAuth()
@UseGuards(AuthUserIdGuard)
@Controller("pair-game-quiz/pairs")
export class PairGameQuizPairsController {

  constructor(private pairGameQuizService: PairGameQuizService) {
  }


  @ApiOperation({ summary: "Returns current unfinished user game" })
  @ApiResponse({
    status: 200, type: GamePairViewDto,
    description: "Returns current pair in which current user is taking part"
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "If no active pair for current user" })
  @Get("my-current")
  async getCurrentGame(@CurrentUserId() userId: string): Promise<GamePairViewDto> {
    return this.pairGameQuizService.findCurrentGameByUserId(userId);
  }


  @ApiOperation({ summary: "Returns all my games (closed games and current)" })
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
  @ApiExtraModels(PaginatorDto)
  @ApiResponse({
    status: 200, description: "Returns pair by id if current user is taking part in this pair",
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatorDto) },
        {
          properties: {
            items: {
              type: "array",
              items: { $ref: getSchemaPath(GamePairViewDto) }
            }
          }
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get("my")
  async getAllMyGames(@Pagination() paginationParams: PaginationParams,
                      @CurrentUserId() userId: string): Promise<PaginatorDto<GamePairViewDto[]>> {
    return this.pairGameQuizService.findAllGamesByUserId(userId, paginationParams);
  }




  @ApiOperation({ summary: "Returns game by id" })
  @ApiResponse({ status: 200, type: GamePairViewDto, description: "Returns pair by id" })
  @ApiResponse({ status: 400, description: "If id has invalid format", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "If current user tries to get pair in which user is not participant" })
  @ApiResponse({ status: 404, description: "If game not found" })
  @Get(":id")
  async getCameById(@Param("id", new ParseUUIDPipe({
                      exceptionFactory: (errors) => {
                        throw new BadRequestException([{ field: "id", message: errors }]);
                      }
                    })) gameId: string,
                    @CurrentUserId() userId: string): Promise<GamePairViewDto> {
    return this.pairGameQuizService.findGameById(gameId, userId);
  }


  @ApiOperation({ summary: "Connect current user to existing random pending pair or create new pair which will be waiting second player" })
  @ApiResponse({
    status: 200, type: GamePairViewDto,
    description: `Returns started existing pair or new pair with status "PendingSecondPlayer"`
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "If current user is already participating in active pair" })
  @Post("connection")
  @HttpCode(HttpStatus.OK)
  async connectGame(@CurrentUserId() userId: string): Promise<GamePairViewDto> {
    return this.pairGameQuizService.connectGame(userId);
  }



  @ApiOperation({ summary: "Send answer for next not answered question in active pair" })
  @ApiBody({ type: InputAnswerDto })
  @ApiResponse({ status: 200,description: "Returns answer result", type: AnswerViewDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "If current user is not inside active pair or user is in active pair but has already answered to all questions" })
  @Post("my-current/answers")
  @HttpCode(HttpStatus.OK)
  async sendAnswer(@Body() answerDto: InputAnswerDto,
                   @CurrentUserId() userId: string): Promise<AnswerViewDto> {
    return this.pairGameQuizService.sendAnswer(userId, answerDto.answer);
  }

}


/////////////////////////////////////////////////////////////
@ApiTags("PairQuizGame")
@Controller("pair-game-quiz/users")
export class PairGameQuizUsersController {

  constructor(private pairGameQuizService: PairGameQuizService) {
  }

  @ApiOperation({ summary: "Get current user statistic" })
  @ApiResponse({ status: 200, type: StatisticViewDto })
  @Get("my-statistic")
  async getMyStatistic(@CurrentUserId() userId: string) {
    //: Promise<StatisticViewDto>
    let result:any = await this.pairGameQuizService.getStatisticByUserId(userId)
    result.drawCount = result.drawsCount
    delete result.drawsCount
    return result
    //return this.pairGameQuizService.getStatisticByUserId(userId);
  }


  // @Get("my-statistic/:userId")
  // async getMyStatistic2(@Param("userId") userId: string): Promise<StatisticViewDto> {
  //   return this.pairGameQuizService.getStatisticByUserId(userId);
  // }

}
