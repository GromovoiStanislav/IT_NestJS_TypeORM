import { IsString, IsNotEmpty, MaxLength, Matches, IsUrl } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class InputBlogDto {
  @ApiProperty({ type: String, maxLength: 15 })
  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  name: string

  @ApiProperty({ type: String, maxLength: 500 })
  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: String, maxLength: 100 })
  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/ as RegExp)
  @IsUrl()
  websiteUrl: string
}

