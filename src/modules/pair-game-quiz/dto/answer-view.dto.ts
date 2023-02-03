import { ApiProperty } from "@nestjs/swagger";
import { AnswerStatus } from "../game.entity";

export class AnswerViewDto {
  @ApiProperty({ required: false, type: String })
  questionId: string;

  @ApiProperty({ required: false, enum: AnswerStatus })
  answerStatus: AnswerStatus;

  @ApiProperty({ required: false, format: "date-time" })
  addedAt: string;
}