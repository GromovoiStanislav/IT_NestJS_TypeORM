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
import { ViewAccessTokenDto } from "./dto/view-access-token.dto";


@ApiTags("Auth")
@UseGuards(ThrottlerGuard)
@Controller("auth")
export class AuthController {

  constructor(private commandBus: CommandBus) {
  }

  @ApiOperation({ summary: "Registration in the system. Email with confirmation code will be send to passed email address" })
  @ApiBody({ required: true, type: InputUserDto })
  @ApiResponse({
    status: 204,
    description: "Input data is accepted. Email with confirmation code will be send to passed email address"
  })
  @ApiResponse({
    status: 400,
    description: "If the inputModel has incorrect values (in particular if the user with the given email or password already exists)",
    type: APIErrorResult
  })
  @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
  @Post("registration")
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Body() inputUser: InputUserDto): Promise<void> {
    await this.commandBus.execute(new RegisterUserCommand(inputUser));
  }



  @ApiOperation({ summary: "Confirm registration" })
  @ApiBody({ required: true, type: InputCodeDto })
  @ApiResponse({ status: 204, description: "Email was verified. Account was activated" })
  @ApiResponse({
    status: 400,
    description: "If the confirmation code is incorrect, expired or already been applied",
    type: APIErrorResult
  })
  @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
  @Post("registration-confirmation")
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() inputCode: InputCodeDto): Promise<void> {
    await this.commandBus.execute(new ConfirmEmailCommand(inputCode.code));
  }


  @ApiOperation({ summary: "Resend confirmation registration Email if user exists" })
  @ApiBody({ required: true, description:"Data for constructing new user", type: InputCodeDto })
  @ApiResponse({
    status: 204,
    description: `Input data is accepted.Email with confirmation code will be send to passed email address. 
    Confirmation code should be inside link as query param, for example:
     https://some-front.com/confirm-registration?code=youtcodehere`
  })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
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

  @ApiOperation({ summary: "Try login user to the system" })
  @ApiBody({ required: true, type: InputLoginDto })
  @ApiResponse({
    status: 200,
    description: "Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds)",
    type: ViewAccessTokenDto
  })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "If the password or login is wrong" })
  @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() inputLogin: InputLoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ViewAccessTokenDto> {
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
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this.commandBus.execute(new LogoutUserCommand(req.cookies.refreshToken));
    res.clearCookie("refreshToken");
  }


  @ApiOperation({
    summary: "Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)\n" +
      "Device LastActiveDate should be overrode by issued Date of new refresh token"
  })
  @ApiResponse({
    status: 200,
    description: "Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds)",
    type: ViewAccessTokenDto
  })
  @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
  @Post("refresh-token")
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ViewAccessTokenDto> {
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
