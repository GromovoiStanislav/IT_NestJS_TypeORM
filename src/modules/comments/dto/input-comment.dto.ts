import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InputCommentDto {
  @ApiProperty({ type: String, minLength:20, maxLength:300 })
  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(300)
  content: string
}