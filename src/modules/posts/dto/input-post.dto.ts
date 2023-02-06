import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Validate,
} from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { BlogIdValidator } from "./blogId.validator";
import { ApiProperty } from "@nestjs/swagger";

export class InputPostDto {
  @ApiProperty({ type: String, maxLength: 30 })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title: string;

  @ApiProperty({ type: String, maxLength: 100 })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  shortDescription: string;

  @ApiProperty({ type: String, maxLength: 1000 })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @ApiProperty({ type: String})
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Validate(BlogIdValidator)
  blogId: string;
}

