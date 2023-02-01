import { ApiProperty } from "@nestjs/swagger";

export class PaginatorDto<T> {
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pagesCount: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  page: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pageSize: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  totalCount: number;

  items: T;
}