import {
  Body,
  Controller,
  Delete, Get,
  HttpCode,
  HttpStatus, NotFoundException,
  Param, Post, Put, UseGuards
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  CreatePostCommand,
  DeletePostCommand,
  GetAllPostsCommand,
  GetOnePostCommand, GetOnePostWithLikesCommand, PostsUpdateLikeByIDCommand,
  UpdatePostCommand
} from "./posts.service";
import { InputPostDto } from "./dto/input-post.dto";
import { ViewPostDto } from "./dto/view-post.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { Pagination } from "../../common/decorators/paginationDecorator";
import { InputLikeDto } from "./dto/input-like.dto";
import { CurrentUserId } from "../../common/decorators/current-userId.decorator";
import { AuthUserIdGuard } from "../../common/guards/auth.userId.guard";
import { BaseAuthGuard } from "../../common/guards/base.auth.guard";
import { InputCommentDto } from "./dto/input-comment.dto";
import { CreateCommentByPostIDCommand, GetAllCommentsByPostIDCommand } from "../comments/comments.service";
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiParam, ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { APIErrorResult } from "../../common/dto/errors-message.dto";
import { ViewCommentDto } from "../comments/dto/view-comment.dto";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";


////////////////////////////////////////////////////////////////////////////

@ApiTags('Posts')
@Controller("posts")
export class PostsController {
  constructor(
    private commandBus: CommandBus) {
  }


  @ApiOperation({ summary: "Delete post specified by id" })
  @ApiBasicAuth()
  @ApiParam({ name: "id", description: "Post id", type: String })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Delete(":id")
  @UseGuards(BaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param("id") postId: string): Promise<void> {
    await this.commandBus.execute(new DeletePostCommand(postId));
  }



  @ApiOperation({ summary: "Create new post" })
  @ApiBasicAuth()
  @ApiBody({ required: true, description: "Data for constructing new post entity", type: InputPostDto})
  @ApiResponse({ status: 201, description: "Returns the newly created post", type: ViewPostDto})
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post()
  @UseGuards(BaseAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() inputPost: InputPostDto): Promise<ViewPostDto> {
    return this.commandBus.execute(new CreatePostCommand(inputPost));
  }



  @ApiOperation({ summary: "Update existing post by id with InputModel" })
  @ApiBasicAuth()
  @ApiParam({ name: "id", description: "Post id", type: String })
  @ApiBody({ required: true, description: "Data for updating", type: InputPostDto})
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Put(":id")
  @UseGuards(BaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param("id") postId: string, @Body() inputPost: InputPostDto): Promise<void> {
    await this.commandBus.execute(new UpdatePostCommand(postId, inputPost));
  }



  @ApiOperation({ summary: "Return post by id" })
  @ApiParam({ name: "id", description: "Id of existing post", type: String })
  @ApiResponse({ status: 200, description: "Success", type: ViewPostDto})
  @ApiResponse({ status: 404, description: "Not Found" })
  @Get(":id")
  async getOnePost(
    @Param("id") postId: string,
    @CurrentUserId() userId: string
  ): Promise<ViewPostDto> {
    return await this.commandBus.execute(new GetOnePostWithLikesCommand(postId, userId));
  }


  @ApiOperation({ summary: "Return all posts" })
  @ApiPaginatedResponse(ViewPostDto)
  @ApiQuery({
    name: "sortDirection", type: String, required: false, enum: ["asc", "desc"],
    description: "Default value: desc"
  })
  @ApiQuery({ name: "sortBy", required: false, schema: { default: "createdAt", type: "string" } })
  @ApiQuery({
    name: "pageSize", required: false, schema: { default: 10, type: "integer", format: "int32" },
    description: "pageSize is portions size that should be returned"
  })
  @ApiQuery({
    name: "pageNumber", required: false, schema: { default: 1, type: "integer", format: "int32" },
    description: "pageNumber is number of portions that should be returned"
  })
  @Get()
  async getAllPosts(
    @Pagination() paginationParams: PaginationParams,
    @CurrentUserId() userId: string
  ): Promise<PaginatorDto<ViewPostDto[]>> {
    return this.commandBus.execute(new GetAllPostsCommand(paginationParams, userId));
  }



  @ApiOperation({ summary: "Make like/unlike/dislike/undislike operation" })
  @ApiBasicAuth()
  @ApiParam({ name: "postId", description: "Post id", type: String })
  @ApiBody({ required: true, description: "Like model for make like/dislike/reset operation", type: InputLikeDto})
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "If post with specified postId doesn't exists" })
  @Put(":postId/like-status")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthUserIdGuard)
  async updateLikeByID(
    @Param("postId") postId: string,
    @Body() inputLike: InputLikeDto,
    @CurrentUserId() userId: string): Promise<void> {
    const result = await this.commandBus.execute(new GetOnePostCommand(postId));
    if (!result) {
      throw new NotFoundException();
    }
    await this.commandBus.execute(new PostsUpdateLikeByIDCommand(postId, userId, inputLike.likeStatus));
  }


  @ApiOperation({ summary: "Create new comment" })
  @ApiBasicAuth()
  @ApiParam({ name: "postId", description: "Post id", type: String })
  @ApiBody({ required: true, description: "Data for constructing new post entity", type: InputCommentDto})
  @ApiResponse({ status: 201, description: "Returns the newly created post", type: ViewCommentDto})
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "If post with specified postId doesn't exists" })
  @Post(":postId/comments")
  @UseGuards(AuthUserIdGuard)
  async createCommentByPostID(
    @Param("postId") postId: string,
    @Body() inputComment: InputCommentDto,
    @CurrentUserId() userId: string): Promise<ViewCommentDto> {
    return this.commandBus.execute(new CreateCommentByPostIDCommand(postId, userId, inputComment));
  }


  @ApiOperation({ summary: "Returns comments for specified post" })
  @ApiParam({ name: "postId", description: "Post id", type: String })
  @ApiPaginatedResponse(ViewCommentDto)
  @ApiQuery({
    name: "sortDirection", type: String, required: false, enum: ["asc", "desc"],
    description: "Default value: desc"
  })
  @ApiQuery({ name: "sortBy", required: false, schema: { default: "createdAt", type: "string" } })
  @ApiQuery({
    name: "pageSize", required: false, schema: { default: 10, type: "integer", format: "int32" },
    description: "pageSize is portions size that should be returned"
  })
  @ApiQuery({
    name: "pageNumber", required: false, schema: { default: 1, type: "integer", format: "int32" },
    description: "pageNumber is number of portions that should be returned"
  })
  @Get(":postId/comments")
  async getAllCommentsByPostID(
    @Param("postId") postId: string,
    @Pagination() paginationParams: PaginationParams,
    @CurrentUserId() userId: string): Promise<PaginatorDto<ViewCommentDto[]>> {

    return this.commandBus.execute(new GetAllCommentsByPostIDCommand(paginationParams, postId, userId));
  }


}
