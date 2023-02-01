import { IsNotEmpty, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export class InputLikeDto {
  @ApiProperty({ type: String, description: "Send None if you want to unlike/undislike", enum: LikeStatus })
  @IsNotEmpty()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
