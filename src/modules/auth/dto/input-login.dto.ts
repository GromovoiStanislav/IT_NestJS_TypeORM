import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class InputLoginDto {
  @ApiProperty({ type: String})
  @IsNotEmpty()
  @IsString()
  loginOrEmail: string

  @ApiProperty({ type: String})
  @IsNotEmpty()
  @IsString()
  password: string
}

