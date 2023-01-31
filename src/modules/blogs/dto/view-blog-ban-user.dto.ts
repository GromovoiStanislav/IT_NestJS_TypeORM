import { ApiProperty } from "@nestjs/swagger";

export class ViewBanInfo {
  @ApiProperty({ required: false })
  isBanned: boolean;
  @ApiProperty({ required: false, nullable: true, format: "date-time" })
  banDate: string;
  @ApiProperty({ required: false, nullable: true })
  banReason: string;
}

export class ViewBanBlogUser {
  @ApiProperty({ required: false })
  id: string;
  @ApiProperty({ required: false })
  login: string;
  @ApiProperty({ required: false })
  banInfo: ViewBanInfo;
}

