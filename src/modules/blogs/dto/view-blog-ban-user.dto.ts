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


export class PaginatedViewBanBlogUser {
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pagesCount: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  page: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pageSize: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  totalCount: number;

  @ApiProperty({ type: ViewBanBlogUser, isArray: true, required: false })
  items: ViewBanBlogUser[];
}
