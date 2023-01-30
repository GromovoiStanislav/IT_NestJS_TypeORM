import { ApiProperty } from "@nestjs/swagger";

export class ViewQuizDto {
  @ApiProperty({
    type: String,
    required: false
  })
  id: string;

  @ApiProperty({
    type: String,
    description: "Text of question, for example: How many continents are there?",
    required: false
  })
  body: string;

  @ApiProperty({
    type: [String],
    nullable:true,
    description: "All variants of possible correct answers for current questions Examples: ['6', 'six', 'шесть', 'дофига']",
    required: false
  })
  correctAnswers: string[];

  @ApiProperty({
    type: Boolean,
    default: false,
    description: "If question is completed and can be used in the Quiz game",
    required: false
  })
  published: boolean;

  @ApiProperty({
    type: String,
    required: false,
    format:'date-time'
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    required: false,
    format:'date-time'
  })
  updatedAt: string;
}

