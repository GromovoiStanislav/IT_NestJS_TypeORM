import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class InputBanUserDto {
  @ApiProperty({ description: "true - for ban user, false - for unban user", type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @ApiProperty({ description: "The reason why user was banned", type: String, minLength: 20 })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  banReason: string;
}