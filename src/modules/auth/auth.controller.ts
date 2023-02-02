import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request, Response } from "express";

import { InputUserDto } from "./dto/input-user.dto";
import {
  RegisterUserCommand,
  ResendConfirmationCodeCommand,
  ConfirmEmailCommand,
  LoginUserCommand,
  GetMeInfoCommand,
  RefreshTokenCommand,
  LogoutUserCommand,
  PasswordRecoveryCommand,
  NewPasswordCommand
} from "./auth.service";
import { InputEmailDto } from "./dto/input-email.dto";
import { InputCodeDto } from "./dto/input-code.dto";
import { InputLoginDto } from "./dto/input-login.dto";
import { BearerAuthGuard } from "../../common/guards/bearer.auth.guard";
import { CurrentUserId } from "../../common/decorators/current-userId.decorator";
import { SkipThrottle, ThrottlerGuard } from "@nestjs/throttler";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { APIErrorResult } from "../../common/dto/errors-message.dto";
import { ViewAboutMeDto } from "./dto/view-about-me.dto";
import { InputPasswordDto } from "./dto/input-password.dto";


@ApiTags("Auth")
@UseGuards(ThrottlerGuard)
@Controller("auth")
export class AuthController {

  constructor(private commandBus: CommandBus) {
  }


  @Post("registration")
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Body() inputUser: InputUserDto) {
    await this.commandBus.execute(new RegisterUserCommand(inputUser));
  }


  @Post("registration-confirmation")
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() inputCode: InputCodeDto) {
    await this.commandBus.execute(new ConfirmEmailCommand(inputCode.code));
  }


  @Post("registration-email-resending")
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendConfirmationCode(@Body() inputEmail: InputEmailDto) {
    await this.commandBus.execute(new ResendConfirmationCodeCommand(inputEmail.email));
  }


  @ApiOperation({ summary: "Password recovery via email confirmation. Email should be sent with RecoveryCode inside" })
  @ApiBody({ required: true, description: "Data for constructing new user", type: InputEmailDto })
  @ApiResponse({
    status: 204,
    description: "Even if current email is not registered (for prevent user's email detection)"
  })
  @ApiResponse({
    status: 400,
    description: "If the inputModel has invalid email (for example 222^gmail.com)",
    type: APIErrorResult
  })
  @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
  @Post("password-recovery")
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() inputEmail: InputEmailDto): Promise<void> {
    await this.commandBus.execute(new PasswordRecoveryCommand(inputEmail.email));
  }


  @ApiOperation({ summary: "Confirm Password recovery" })
  @ApiBody({ type: InputPasswordDto })
  @ApiResponse({ status: 204, description: "If code is valid and new password is accepted" })
  @ApiResponse({
    status: 400,
    description: "If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired",
    type: APIErrorResult
  })
  @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
  @Post("new-password")
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() inputPassword: InputPasswordDto): Promise<void> {
    await this.commandBus.execute(new NewPasswordCommand(inputPassword.newPassword, inputPassword.recoveryCode));
  }


  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() inputLogin: InputLoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    let title = req.header("user-agent")?.split(" ")[0] ?? "";

    const JWT_Tokens = await this.commandBus.execute(new LoginUserCommand(inputLogin.loginOrEmail, inputLogin.password, req.ip, title));
    res.cookie("refreshToken", JWT_Tokens.refreshToken, {
      maxAge: 1000 * 20,
      httpOnly: true,
      secure: true
    });
    return { accessToken: JWT_Tokens.accessToken };
  }



  @ApiOperation({ summary: "In cookie must send correct refreshToken that will be revoked" })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
  @Post("logout")
  @SkipThrottle()
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.commandBus.execute(new LogoutUserCommand(req.cookies.refreshToken));
    res.clearCookie("refreshToken");
  }



  @Post("refresh-token")
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    let title = req.header("user-agent")?.split(" ")[0] ?? "";

    const JWT_Tokens = await this.commandBus.execute(new RefreshTokenCommand(req.cookies.refreshToken, req.ip, title));
    res.cookie("refreshToken", JWT_Tokens.refreshToken, {
      maxAge: 1000 * 20,
      httpOnly: true,
      secure: true
    });
    return { accessToken: JWT_Tokens.accessToken };
  }

  @ApiOperation({ summary: "Get information about current user" })
  @ApiResponse({ status: 200, description: "Success", type: ViewAboutMeDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth()
  @Get("me")
  @SkipThrottle()
  @UseGuards(BearerAuthGuard)
  async getMe(@CurrentUserId() userId: string): Promise<ViewAboutMeDto> {
    return this.commandBus.execute(new GetMeInfoCommand(userId));
  }


}
