import { ApiProperty } from "@nestjs/swagger";

export class ViewAboutMeDto {
  @ApiProperty({ type: String, required: false})
  email: string;
  @ApiProperty({ type: String, required: false})
  login: string;
  @ApiProperty({ type: String, required: false})
  userId: string;
}