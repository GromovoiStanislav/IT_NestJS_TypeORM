import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Req } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from "express";
import {
  ReturnAllDeviceSessionsByCurrentUserCommand,
  TerminateAllOtherDeviceSessionsExcludeCurrentCommand,
  TerminateDeviceSessionCommand
} from "./security.service";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ViewSecurityDto } from "./dto/view-security.dto";


@ApiTags('SecurityDevices')
@Controller("security")
export class SecurityController {

  constructor(private commandBus: CommandBus) {
  }

  @ApiOperation({ summary: "Return all devices with active sessions for current user" })
  @ApiResponse({ status: 200, description: "Success",isArray:true, type: ViewSecurityDto})
  @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
  @Get("devices")
  async returnAllDeviceSessionsByCurrentUser(@Req() req: Request): Promise<ViewSecurityDto[]> {
    return this.commandBus.execute(new ReturnAllDeviceSessionsByCurrentUserCommand(req.cookies.refreshToken));
  }

  @ApiOperation({ summary: "Terminate all others (exclude current) devices sessions" })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
  @Delete("devices")
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateAllOtherDeviceSessionsExcludeCurrent(@Req() req: Request): Promise<void> {
    await this.commandBus.execute(new TerminateAllOtherDeviceSessionsExcludeCurrentCommand(req.cookies.refreshToken));
  }

  @ApiOperation({ summary: "Terminate all others (exclude current) devices sessions" })
  @ApiParam({ name: "deviceId", description: "Id of session that will be terminated", type: String })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
  @ApiResponse({ status: 403, description: "If try to delete the deviceId of other user" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Delete("devices/:deviceId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateDeviceSession(@Req() req: Request, @Param("deviceId") deviceId: string): Promise<void> {
    await this.commandBus.execute(new TerminateDeviceSessionCommand(req.cookies.refreshToken, deviceId ));
  }

}