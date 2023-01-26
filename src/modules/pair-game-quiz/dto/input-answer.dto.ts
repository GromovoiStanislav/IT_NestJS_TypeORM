import { IsNotEmpty, IsString } from "class-validator";


export class InputAnswerDto {
  @IsString()
  @IsNotEmpty()
  answer: string
}