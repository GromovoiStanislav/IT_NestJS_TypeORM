import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class InputAnswerDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  answer: string
}