import { IsNotEmpty, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export class InputLikeDto {
  @ApiProperty({enum:LikeStatus, description:"Send None if you want to unlike/undislike"})
  @IsNotEmpty()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
