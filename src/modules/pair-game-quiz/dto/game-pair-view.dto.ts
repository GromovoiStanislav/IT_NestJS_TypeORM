import { AnswerStatus, StatusGame } from "../game.entity";
import { ApiProperty } from "@nestjs/swagger";

///////////////////////////
export class PlayerDto {
  @ApiProperty({ required: false, type: String })
  id: string;

  @ApiProperty({ required: false, type: String })
  login: string;
}

//////////////////////
export class AnswerDto {
  @ApiProperty({ required: false, type: String })
  questionId: string;

  @ApiProperty({ required: false, enum: AnswerStatus })
  answerStatus: AnswerStatus;

  @ApiProperty({ required: false, description: "Date when first player initialized the pair", format: "date-time" })
  addedAt: string;
}

//////////////////////////////////
export class PlayerProgressDto {
  @ApiProperty({ required: false, isArray: true, type: AnswerDto })
  answers: AnswerDto[];

  @ApiProperty({ required: false })
  player: PlayerDto;

  @ApiProperty({ required: false, type: "integer", format: "int32" })
  score: number;
}

/////////////////////////////////
export class QuestionDto {
  @ApiProperty({ required: false, type: String })
  id: string;
  @ApiProperty({ required: false, type: String, description: "Here is the question itself" })
  body: string;
}

//////////////////////////////////////
export class GamePairViewDto {
  @ApiProperty({ required: false, type: String, description: "Id of pair" })
  id: string;

  @ApiProperty({ required: false })
  firstPlayerProgress: PlayerProgressDto;

  @ApiProperty({ required: false })
  secondPlayerProgress: PlayerProgressDto;

  @ApiProperty({
    required: false, nullable: true, isArray: true, type: QuestionDto,
    description: "Questions for both players (can be null if second player haven't connected yet)"
  })
  questions: QuestionDto[];

  @ApiProperty({ required: false, enum: StatusGame })
  status: StatusGame;

  @ApiProperty({ required: false, description: "Date when first player initialized the pair", format: "date-time" })
  pairCreatedDate: string;

  @ApiProperty({
    required: false, format: "date-time", nullable: true,
    description: "Game starts immediately after second player connection to this pair"
  })
  startGameDate: string;

  @ApiProperty({
    required: false, format: "date-time", nullable: true,
    description: "Game finishes immediately after both players have answered all the questions"
  })
  finishGameDate: string;
}

