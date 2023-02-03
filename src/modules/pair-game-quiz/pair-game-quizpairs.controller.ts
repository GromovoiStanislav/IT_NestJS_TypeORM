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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StatisticViewDto } from "./dto/statistic-view.dto";


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


@ApiTags("PairQuizGame")
@ApiBearerAuth()
@UseGuards(AuthUserIdGuard)
@Controller("pair-game-quiz/pairs")
export class PairGameQuizPairsController {

  constructor(private pairGameQuizService: PairGameQuizService) {
  }

  @Get("my-current")
  async getCurrentGame(@CurrentUserId() userId: string): Promise<GamePairViewDto> {
    return this.pairGameQuizService.findCurrentGameByUserId(userId);
  }


  @Get("my")
  async getAllMyGames(@Pagination() paginationParams: PaginationParams,
                      @CurrentUserId() userId: string): Promise<PaginatorDto<GamePairViewDto[]>> {
    return this.pairGameQuizService.findAllGamesByUserId(userId, paginationParams);
  }


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
  @ApiResponse({ status: 200, type: AnswerViewDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "If current user is not inside active pair or user is in active pair but has already answered to all questions" })
  @Post("my-current/answers")
  @HttpCode(HttpStatus.OK)
  async sendAnswer(@Body() answerDto: InputAnswerDto,
                   @CurrentUserId() userId: string): Promise<AnswerViewDto> {
    return this.pairGameQuizService.sendAnswer(userId, answerDto.answer);
  }


}

