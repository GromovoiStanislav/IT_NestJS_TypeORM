import { ApiProperty } from "@nestjs/swagger";

export class ViewSecurityDto {
  @ApiProperty({ type: String, description: 'IP address of device during signing in' })
  ip: string;
  @ApiProperty({ type: String, description: 'Device name: for example Chrome 105 (received by parsing http header "user-agent")' })
  title: string;
  @ApiProperty({ type: String, description: 'Date of the last generating of refresh/access tokens' })
  deviceId: string;
  @ApiProperty({ type: String, description: 'Id of connected device session' })
  lastActiveDate: string;
}