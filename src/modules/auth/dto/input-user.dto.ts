import { IsString, IsNotEmpty, IsEmail, Length } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class InputUserDto {
  @ApiProperty({ type: String, minLength: 3, maxLength: 10 })
  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  login: string

  @ApiProperty({ type: String, minLength: 6, maxLength: 20 })
  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string

  @ApiProperty({ type: String,
    //pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string
}

