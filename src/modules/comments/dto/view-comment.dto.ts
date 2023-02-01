import { LikesInfoDto } from "../../../common/dto/likesInfoDto";
import { ApiProperty } from "@nestjs/swagger";

export class ViewCommentDto {
  @ApiProperty({ type: String, required: false })
  id: string;

  @ApiProperty({ type: String, required: false })
  content: string;

  @ApiProperty({ type: String, required: false })
  userId: string;

  @ApiProperty({ type: String, required: false })
  userLogin: string;

  @ApiProperty({ required: false, format: "date-time" })
  createdAt: string;

  @ApiProperty({ required: false })
  likesInfo: LikesInfoDto;
}