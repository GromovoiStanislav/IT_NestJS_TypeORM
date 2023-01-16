import { ViewSecurityDto } from "./view-security.dto";
import { CreateDeviceDto } from "./create-device.dto";

export class SecurityMapper {
  static fromModelToView(data: CreateDeviceDto): ViewSecurityDto {
    const viewSecurity = new ViewSecurityDto();
    viewSecurity.deviceId = data.deviceId;
    viewSecurity.lastActiveDate = data.issuedAt;
    viewSecurity.ip = data.ip;
    viewSecurity.title = data.title;
    return viewSecurity;
  }
}