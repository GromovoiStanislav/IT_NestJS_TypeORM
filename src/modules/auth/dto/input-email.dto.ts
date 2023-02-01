import {  IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class InputEmailDto {
  @ApiProperty({ type: String, description: "Email of registered user",
    //pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string
}

