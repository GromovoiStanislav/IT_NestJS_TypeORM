import { IsNotEmpty, IsEmail, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";


export class InputPasswordDto {
  @ApiProperty({ type: String, description: "New password", minLength: 6, maxLength: 20 })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;

  @ApiProperty({ type: String, description: "Recovery cod" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}

