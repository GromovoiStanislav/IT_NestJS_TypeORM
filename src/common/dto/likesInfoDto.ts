import { ApiProperty } from "@nestjs/swagger";
import { LikeStatus } from "../../modules/comments/dto/input-like.dto";

export class LikesInfoDto {
  @ApiProperty({ required: false, description: "Total likes for parent item", format: "int32", type:"integer" })
  likesCount: number = 0;

  @ApiProperty({ required: false, description: "Total dislikes for parent item", format: "int32", type:"integer" })
  dislikesCount: number = 0;

  @ApiProperty({ required: false, description: "Send None if you want to unlike/undislike", enum: LikeStatus })
  myStatus: LikeStatus = LikeStatus.None;//:string="None"

  commentId?: string;

}