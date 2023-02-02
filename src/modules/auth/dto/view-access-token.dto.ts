import { ApiProperty } from "@nestjs/swagger";

export class ViewAccessTokenDto {
  @ApiProperty({ type: String, required: false,description: "JWT access token"})
  accessToken: string;
}