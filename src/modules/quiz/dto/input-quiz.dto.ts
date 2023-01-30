import { Transform, TransformFnParams } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class InputQuizDto {
  @ApiProperty({
    type: String,
    required: true,
    minLength: 10,
    maxLength: 500
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  body: string;

  @ApiProperty({
    type: [String],
    //isArray: true,
    required: true,
    description: `All variants of possible correct answers for current questions Examples: [6, 'six', 'шесть', 'дофига']. In Postgres save this data in JSON column`
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  correctAnswers: string[];
}