import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class InputBanBlogUserDto {
  @ApiProperty({ description: "true - for ban user, false - for unban user", type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @ApiProperty({ description: "The reason why user was banned", minLength: 20, type: String })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  banReason: string;

  @ApiProperty({ description: "User will be banned/unbanned for this blog", type: String })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  blogId: string;
}