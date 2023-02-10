import { IsNotEmpty, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class InputBanBlogDto {
  @ApiProperty({ type: Boolean, description: "true - for ban blog, false - for unban blog" })
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean
}

