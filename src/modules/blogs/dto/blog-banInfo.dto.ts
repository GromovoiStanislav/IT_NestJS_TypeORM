import { ApiProperty } from "@nestjs/swagger";

export class BanBlogInfo {
  @ApiProperty({ type: Boolean, required: false })
  isBanned: boolean = false;

  @ApiProperty({ type: Boolean, required: false,nullable:true, format: "date-time" })
  banDate: string = null;
}