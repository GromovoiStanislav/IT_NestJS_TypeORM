import { ApiProperty } from "@nestjs/swagger";
import { LikesInfoDto } from "../../../common/dto/likesInfoDto";
import { ExtendedViewBlogDto, PaginatedExtendedViewBlogDto } from "./view-blog.dto";

export class CommentatorInfo {
  @ApiProperty({ type: String, required: false })
  userId: string;

  @ApiProperty({ type: String, required: false })
  userLogin: string;
}

export class PostInfo {
  @ApiProperty({ type: String, required: false })
  id: string;

  @ApiProperty({ type: String, required: false })
  title: string;

  @ApiProperty({ type: String, required: false })
  blogId: string;

  @ApiProperty({ type: String, required: false })
  blogName: string;
}


export class CommentViewDto {
  @ApiProperty({ type: String, required: false })
  id: string;

  @ApiProperty({ type: String, required: false })
  content: string;

  @ApiProperty({ required: false })
  commentatorInfo: CommentatorInfo;

  @ApiProperty({ type: String, required: false, format: "date-time" })
  createdAt: string;

  @ApiProperty({ required: false })
  postInfo: PostInfo;

  @ApiProperty({ required: false })
  likesInfo: LikesInfoDto;
}

export class PaginatedCommentViewDto {
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pagesCount: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  page: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pageSize: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  totalCount: number;

  @ApiProperty({ type: CommentViewDto, isArray: true, required: false })
  items: CommentViewDto[];
}