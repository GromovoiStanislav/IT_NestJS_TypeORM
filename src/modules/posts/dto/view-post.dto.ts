import { ExtendedLikesInfoDto } from "../../../common/dto/extendedLikesInfoDto";
import { ApiProperty } from "@nestjs/swagger";

export class ViewPostDto {
  @ApiProperty({ type: String, required: false })
  id: string;

  @ApiProperty({ type: String, required: false })
  title: string;

  @ApiProperty({ type: String, required: false })
  shortDescription: string;

  @ApiProperty({ type: String, required: false })
  content: string;

  @ApiProperty({ type: String, required: false })
  blogId: string;

  @ApiProperty({ type: String, required: false })
  blogName: string;

  @ApiProperty({ type: String, required: false, format: "date-time" })
  createdAt: string;

  @ApiProperty({ required: false })
  extendedLikesInfo: ExtendedLikesInfoDto;

}