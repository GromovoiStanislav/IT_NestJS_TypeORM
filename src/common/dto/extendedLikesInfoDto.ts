import { LikeDetailsViewDto } from "./likeDetailsViewDto";
import { ApiProperty } from "@nestjs/swagger";

export class ExtendedLikesInfoDto {
  @ApiProperty({
    type: "integer", format: "int32", required: false,
    description: "Total likes for parent item"
  })
  likesCount: number = 0;

  @ApiProperty({
    type: "integer", format: "int32", required: false,
    description: "Total dislikes for parent item"
  })
  dislikesCount: number = 0;

  @ApiProperty({
    type: String, enum: ["None", "Like", "Dislike"], required: false,
    description: "Send None if you want to unlike/undislike"
  })
  myStatus: string = "None";

  @ApiProperty({ description: `Last 3 likes (status "Like")`, required: false, nullable: true,isArray:true,type:LikeDetailsViewDto })
  newestLikes: LikeDetailsViewDto[] = [];


  postId?: string;
}