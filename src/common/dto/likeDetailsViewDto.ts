import { ApiProperty } from "@nestjs/swagger";


export class LikeDetailsViewDto {

  @ApiProperty({ type: String, required: false, format: "date-time" })
  addedAt: string;

  @ApiProperty({ type: String, required: false, nullable:true})
  userId: string;

  @ApiProperty({ type: String, required: false, nullable:true})
  login: string;

  postId?: string;
}
