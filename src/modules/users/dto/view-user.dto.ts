import { BanUsersInfo } from "./user-banInfo.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ViewUserDto {
  @ApiProperty({ required: false })
  id: string;
  @ApiProperty({ required: false })
  login: string;
  @ApiProperty({ required: false })
  email: string;
  @ApiProperty({ required: false, format: "date-time" })
  createdAt: string;
  @ApiProperty({ required: false })
  banInfo: BanUsersInfo;
}

