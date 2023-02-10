import { BlogOwnerDto } from "./blog-owner.dto";
import { BanBlogInfo } from "./blog-banInfo.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ViewBlogDto {
  @ApiProperty({ type: String, required: false })
  id: string;

  @ApiProperty({ type: String, required: false })
  name: string;

  @ApiProperty({ type: String, required: false })
  websiteUrl: string;

  @ApiProperty({ type: String, required: false })
  description: string;

  @ApiProperty({ type: String, required: false, format: "date-time" })
  createdAt: string;

  @ApiProperty({
    type: Boolean, required: false,
    description: "True if user has not expired membership subscription to blog"
  })
  isMembership?: boolean;

  blogOwnerInfo?: BlogOwnerDto;

  banInfo?: BanBlogInfo;
}


export class ExtendedViewBlogDto extends ViewBlogDto {
  @ApiProperty({ required: false })
  blogOwnerInfo?: BlogOwnerDto;

  @ApiProperty({ required: false })
  banInfo?: BanBlogInfo;
}

export class PaginatedExtendedViewBlogDto {
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pagesCount: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  page: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pageSize: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  totalCount: number;

  @ApiProperty({ type: ExtendedViewBlogDto, isArray: true, required: false })
  items: ExtendedViewBlogDto[];
}