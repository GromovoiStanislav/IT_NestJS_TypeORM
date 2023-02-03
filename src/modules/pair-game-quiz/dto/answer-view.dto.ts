import { ApiProperty } from "@nestjs/swagger";

export class AnswerViewDto {
  questionId: string;


  answerStatus: string;

  @ApiProperty({ required: false, description: "Date when first player initialized the pair", format: "date-time" })
  addedAt: string;
}