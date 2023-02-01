import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
  Post, Put,
  Query, UseGuards
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { Input_UserDto, InputUserDto } from "./dto/input-user.dto";
import {
  BanUserCommand,
  CreateUserCommand,
  DeleteUserCommand,
  FindAllUsersCommand, GetUserByConfirmationCodeCommand
} from "./users.service";
import { BaseAuthGuard } from "../../common/guards/base.auth.guard";
import { Pagination } from "../../common/decorators/paginationDecorator";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { InputBanUserDto } from "./dto/input-ban-user.dto";
import { BearerAuthGuard } from "../../common/guards/bearer.auth.guard";
import { InputBanBlogUserDto } from "./dto/input-blog-ban-user.dto";
import { BanUserForBlogCommand, ReturnAllBannedUsersForBlogCommand } from "../blogs/blogs.service";
import { CurrentUserId } from "../../common/decorators/current-userId.decorator";
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiExcludeEndpoint, ApiBody, ApiExtraModels, getSchemaPath, ApiQuery
} from "@nestjs/swagger";
import { APIErrorResult } from "../../common/dto/errors-message.dto";
import { ViewUserDto } from "./dto/view-user.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";
import { ViewBanBlogUser } from "../blogs/dto/view-blog-ban-user.dto";



///////////////////////////////////////////////////


@ApiBasicAuth()
@ApiTags("Users")
@UseGuards(BaseAuthGuard)
@Controller("sa/users")
export class SaUsersController {

  constructor(private commandBus: CommandBus) {
  }


  @ApiOperation({ summary: "Return all users" })
  @ApiExtraModels(PaginatorDto)
  @ApiResponse({
    status: 200, description: "Success",
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatorDto) },
        {
          properties: {
            items: {
              type: "array",
              items: { $ref: getSchemaPath(ViewUserDto) }
            }
          }
        }
      ]
    }
  })
  @ApiQuery({
    name: "pageSize", required: false, schema: { default: 10, type: "integer", format: "int32" },
    description: "pageSize is portions size that should be returned"
  })
  @ApiQuery({
    name: "pageNumber", required: false, schema: { default: 1, type: "integer", format: "int32" },
    description: "pageNumber is number of portions that should be returned"
  })
  @ApiQuery({
    name: "sortDirection", type: String, required: false, enum: ["asc", "desc"],
    description: "Default value: desc"
  })
  @ApiQuery({ name: "sortBy", required: false, schema: { default: "createdAt", type: "string" } })
  @ApiQuery({
    name: "searchEmailTerm", type: String, required: false, schema: { default: null },
    description: "Search term for user Email: Email should contains this term in any position"
  })
  @ApiQuery({
    name: "searchLoginTerm", type: String, required: false, schema: { default: null },
    description: "Search term for user Login: Login should contains this term in any position"
  })
  @ApiQuery({
    name: "banStatus", type: String, required: false, enum: ["all", "banned", "notBanned"],
    description: "Default value: all"
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get()
  async getUsers(@Query() query, @Pagination() paginationParams: PaginationParams):Promise<PaginatorDto<ViewUserDto[]>> {
    const searchLogin = query.searchLoginTerm as string || "";
    const searchEmail = query.searchEmailTerm as string || "";
    const banStatus = query.banStatus as string || "";
    return this.commandBus.execute(new FindAllUsersCommand(banStatus.trim(), searchLogin.trim(), searchEmail.trim(), paginationParams));
  }


  @ApiOperation({ summary: "Delete user specified by id" })
  @ApiParam({ name: "id", description: "User id", type: String })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "If specified user is not exists" })
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param("id") userId: string): Promise<void>  {
    await this.commandBus.execute(new DeleteUserCommand(userId));
  }

  @ApiOperation({ summary: "Add new user to the system" })
  @ApiBody({ required: true, description: "Data for constructing new user", type: Input_UserDto })
  @ApiResponse({ status: 201, description: "Returns the newly created user", type: ViewUserDto })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() inputUser: InputUserDto): Promise<ViewUserDto> {
    return this.commandBus.execute(new CreateUserCommand(inputUser, ""));
  }

  @ApiOperation({ summary: "Ban/unban user" })
  @ApiParam({ name: "id", description: "User ID that should be banned", type: String })
  @ApiBody({ required: true, description: "Info for update ban status", type: InputBanUserDto })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Put(":id/ban")
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUser(@Param("id") userId: string, @Body() inputBanUser: InputBanUserDto): Promise<void> {
    await this.commandBus.execute(new BanUserCommand(userId, inputBanUser));
  }

  @ApiExcludeEndpoint()
  @Get("confirmationCode/:cod")
  async getUsersByConfirmationCode(@Param("cod") confirmationCode: string) {
    return this.commandBus.execute(new GetUserByConfirmationCodeCommand(confirmationCode));
  }

}

@ApiBearerAuth()
@ApiTags("Users")
@UseGuards(BearerAuthGuard)
@Controller("blogger/users")
export class BloggerUsersController {

  constructor(private commandBus: CommandBus) {
  }

  @ApiOperation({ summary: "Ban/unban user" })
  @ApiParam({ name: "id", description: "User ID that should be banned", type: String })
  @ApiBody({ required: true, description: "Info for update ban status", type: InputBanBlogUserDto })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Put(":id/ban")
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUser(@Param("id") userId: string,
                @Body() inputBanBlogUserDto: InputBanBlogUserDto,
                @CurrentUserId() ownerId: string): Promise<void> {
    await this.commandBus.execute(new BanUserForBlogCommand(ownerId, userId, inputBanBlogUserDto));
  }



  @ApiOperation({ summary: "Return all banned users for blog" })
  @ApiExtraModels(PaginatorDto)
  @ApiResponse({
    status: 200, description: "Success",
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatorDto) },
        {
          properties: {
            items: {
              type: "array",
              items: { $ref: getSchemaPath(ViewBanBlogUser) }
            }
          }
        }
      ]
    }
  })
  @ApiQuery({
    name: "pageSize", required: false, schema: { default: 10, type: "integer", format: "int32" },
    description: "pageSize is portions size that should be returned"
  })
  @ApiQuery({
    name: "pageNumber", required: false, schema: { default: 1, type: "integer", format: "int32" },
    description: "pageNumber is number of portions that should be returned"
  })
  @ApiQuery({
    name: "sortDirection", type: String, required: false, enum: ["asc", "desc"],
    description: "Default value: desc"
  })
  @ApiQuery({ name: "sortBy", required: false, schema: { default: "createdAt", type: "string" } })
  @ApiQuery({
    name: "searchLoginTerm", type: String, required: false, schema: { default: null },
    description: "Search term for user Login: Login should contains this term in any position"
  })
  @ApiParam({ name: "id", description: "Blog ID", type: String })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get("blog/:id")
  async getUsers(@Param("id") blogId: string,
                 @Query() query,
                 @Pagination() paginationParams: PaginationParams,
                 @CurrentUserId() ownerId: string):Promise<PaginatorDto<ViewBanBlogUser[]>>  {
    const searchLogin = query.searchLoginTerm as string || "";
    return this.commandBus.execute(new ReturnAllBannedUsersForBlogCommand(ownerId, blogId, searchLogin.trim(), paginationParams));
  }

}
