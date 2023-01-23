import { Transform, TransformFnParams } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Length } from "class-validator";


export class InputQuizDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  body: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  correctAnswers: string[];
}