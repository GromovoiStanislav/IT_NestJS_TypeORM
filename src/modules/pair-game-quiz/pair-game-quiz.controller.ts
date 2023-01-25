import {
  BadRequestException,
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
import { ValidationIdPipe } from "../../pipes/validation-id.pipe";
import { PairGameQuizService } from "./pair-game-quiz.service";

@UseGuards(AuthUserIdGuard)
@Controller("pair-game-quiz/pairs")
export class PairGameQuizController {

  constructor(private pairGameQuizService: PairGameQuizService) {
  }

  @Get("my-current")
  async getCurrentCame(@CurrentUserId() userId: string) {
    return {
      "id": "string",
      "firstPlayerProgress": {
        "answers": [
          {
            "questionId": "string",
            "answerStatus": "Correct",
            "addedAt": "2023-01-25T04:21:09.596Z"
          }
        ],
        "player": {
          "id": "string",
          "login": "string"
        },
        "score": 0
      },
      "secondPlayerProgress": {
        "answers": [
          {
            "questionId": "string",
            "answerStatus": "Correct",
            "addedAt": "2023-01-25T04:21:09.596Z"
          }
        ],
        "player": {
          "id": "string",
          "login": "string"
        },
        "score": 0
      },
      "questions": [
        {
          "id": "string",
          "body": "string"
        }
      ],
      "status": "PendingSecondPlayer",
      "pairCreatedDate": "2023-01-25T04:21:09.596Z",
      "startGameDate": "2023-01-25T04:21:09.596Z",
      "finishGameDate": "2023-01-25T04:21:09.596Z"
    };
  }


  @Get(":id")
  async getCameById(@Param("id", new ParseUUIDPipe({
                        exceptionFactory: (errors) => {
                          throw new BadRequestException([{ field: 'id', message: errors }]);
                        }
                      })) gameId: string,
                    @CurrentUserId() userId: string) {
    return {
      "id": "string",
      "firstPlayerProgress": {
        "answers": [
          {
            "questionId": "string",
            "answerStatus": "Correct",
            "addedAt": "2023-01-25T04:19:43.495Z"
          }
        ],
        "player": {
          "id": "string",
          "login": "string"
        },
        "score": 0
      },
      "secondPlayerProgress": {
        "answers": [
          {
            "questionId": "string",
            "answerStatus": "Correct",
            "addedAt": "2023-01-25T04:19:43.495Z"
          }
        ],
        "player": {
          "id": "string",
          "login": "string"
        },
        "score": 0
      },
      "questions": [
        {
          "id": "string",
          "body": "string"
        }
      ],
      "status": "PendingSecondPlayer",
      "pairCreatedDate": "2023-01-25T04:19:43.495Z",
      "startGameDate": "2023-01-25T04:19:43.495Z",
      "finishGameDate": "2023-01-25T04:19:43.495Z"
    };
  }


  @Post("connection")
  @HttpCode(HttpStatus.OK)
  async connectGame(@CurrentUserId() userId: string):Promise<string> {
    return this.pairGameQuizService.connectGame(userId)
  }


  @Post("my-current/answers")
  @HttpCode(HttpStatus.OK)
  async sendAnswer(@CurrentUserId() userId: string) {
    return {
      "questionId": "string",
      "answerStatus": "Correct",
      "addedAt": "2023-01-25T04:46:00.251Z"
    };
  }


}

