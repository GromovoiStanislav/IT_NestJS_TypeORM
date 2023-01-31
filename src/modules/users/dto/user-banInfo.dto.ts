import { ApiProperty } from "@nestjs/swagger";

export class BanUsersInfo {
  @ApiProperty({ required: false })
  isBanned: boolean = false;
  @ApiProperty({ required: false, format: "date-time", nullable: true })
  banDate: string = null;
  @ApiProperty({ required: false, nullable: true })
  banReason: string = null;
}