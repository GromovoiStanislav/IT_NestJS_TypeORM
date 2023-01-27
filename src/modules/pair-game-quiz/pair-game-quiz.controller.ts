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
import { AuthUserIdGuard } from "../../guards/auth.userId.guard";
import { CurrentUserId } from "../../decorators/current-userId.decorator";
import { PairGameQuizService } from "./pair-game-quiz.service";
import { InputAnswerDto } from "./dto/input-answer.dto";
import { GamePairViewDto } from "./dto/game-pair-view.dto";
import { AnswerViewDto } from "./dto/answer-view.dto";
import { Pagination } from "../../decorators/paginationDecorator";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";

@UseGuards(AuthUserIdGuard)
@Controller("pair-game-quiz/pairs")
export class PairGameQuizController {

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




  @Post("connection")
  @HttpCode(HttpStatus.OK)
  async connectGame(@CurrentUserId() userId: string): Promise<GamePairViewDto> {
    return this.pairGameQuizService.connectGame(userId);
  }


  @Post("my-current/answers")
  @HttpCode(HttpStatus.OK)
  async sendAnswer(@Body() answerDto: InputAnswerDto,
                   @CurrentUserId() userId: string): Promise<AnswerViewDto> {
    return this.pairGameQuizService.sendAnswer(userId, answerDto.answer);
  }


}

