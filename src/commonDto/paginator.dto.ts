import { ApiProperty } from "@nestjs/swagger";

export class PaginatorDto <T>{
  @ApiProperty()
  pagesCount:	number
  @ApiProperty()
  page:	number
  @ApiProperty()
  pageSize:	number
  @ApiProperty()
  totalCount:	number

  items: T
}