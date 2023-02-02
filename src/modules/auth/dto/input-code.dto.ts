import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";


export class InputCodeDto {
  @ApiProperty({ type: String, description:"Code that be sent via Email inside link" })
  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  code: string
}

