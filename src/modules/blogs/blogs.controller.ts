import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus, NotFoundException,
  Param,
  Post, Put, Query, UseGuards
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  BanBlogCommand,
  BindBlogWithUserCommand,
  CreateBlogCommand,
  DeleteBlogCommand, GetAllBlogsByUserIdCommand, GetAllBlogsCommand, GetAllCommentsForMyBlogsCommand,
  GetOneBlogCommand,
  UpdateBlogCommand
} from "./blogs.service";
import { InputBlogDto } from "./dto/input-blog.dto";
import { ExtendedViewBlogDto, PaginatedExtendedViewBlogDto, ViewBlogDto } from "./dto/view-blog.dto";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";
import { ViewPostDto } from "../posts/dto/view-post.dto";
import {
  CreatePostByBlogIdCommand,
  DeletePostByBlogIdAndPostIdCommand,
  GetAllPostsByBlogIdCommand, UpdatePostByBlogIdAndPostIdCommand
} from "../posts/posts.service";
import { InputBlogPostDto } from "../posts/dto/input-blog-post.dto";
import { Pagination } from "../../common/decorators/paginationDecorator";
import { BaseAuthGuard } from "../../common/guards/base.auth.guard";
import { BearerUserIdGuard } from "../../common/guards/bearer.userId.guard";
import { CurrentUserId } from "../../common/decorators/current-userId.decorator";
import { AuthUserIdGuard } from "../../common/guards/auth.userId.guard";
import { InputBanBlogDto } from "./dto/input-ban-blog.dto";
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam, ApiQuery,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { APIErrorResult } from "../../common/dto/errors-message.dto";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { CommentViewDto, PaginatedCommentViewDto } from "./dto/comment-view.dto";




//////////////////////////////////////////////////////////////

@ApiTags("Blogs")
@Controller("blogs")
export class BlogsController {

  constructor(
    private commandBus: CommandBus) {
  }


  @ApiOperation({ summary: "Returns blogs with paging" })
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
  @ApiQuery({
    name: "searchNameTerm", type: String, required: false, schema: { default: null },
    description: "Search term for blog Name: Name should contains this term in any position"
  })
  @ApiPaginatedResponse(ViewBlogDto)
  @Get()
  async getAllBlogs(@Query() query, @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewBlogDto[]>> {
    const searchNameTerm = query.searchNameTerm as string || "";
    return this.commandBus.execute(new GetAllBlogsCommand(searchNameTerm.trim(), paginationParams));
  }



  @ApiOperation({ summary: "Returns blog by id" })
  @ApiParam({ name: "id", type: String, description: "Existing blog id" })
  @ApiResponse({ status: 200, description: "Success", type: ViewBlogDto })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Get(":id")
  async getOneBlog(@Param("id") blogId: string): Promise<ViewBlogDto> {
    return this.commandBus.execute(new GetOneBlogCommand(blogId));
  }



  @ApiOperation({ summary: "Returns all posts for specified blog" })
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
  @ApiParam({ name: "id", type: String, description: "Blog ID"})
  @ApiPaginatedResponse(ViewPostDto)
  @ApiResponse({ status: 404, description: "If specified blog is not exists" })
  @Get(":id/posts")
  @UseGuards(BearerUserIdGuard)
  async getOnePost(
    @Param("id") blogId: string,
    @CurrentUserId() userId: string,
    @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewPostDto[]>> {
    if (!await this.commandBus.execute(new GetOneBlogCommand(blogId))) {
      throw new NotFoundException();
    }
    return this.commandBus.execute(new GetAllPostsByBlogIdCommand(blogId, userId, paginationParams));
  }

}

//////////////////////////////////////////////////////////////
@ApiBearerAuth()
@ApiTags("Blogs")
@UseGuards(AuthUserIdGuard)
@Controller("blogger/blogs")
export class BloggerBlogsController {

  constructor(
    private commandBus: CommandBus) {
  }


  @ApiOperation({ summary: "Create new blog" })
  @ApiBody({ description: "Data for constructing new Blog entity", type: InputBlogDto})
  @ApiResponse({ status: 201, description: "Returns the newly created blog", type: ViewBlogDto })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() inputBlog: InputBlogDto,
                   @CurrentUserId() userId: string): Promise<ViewBlogDto> {
    return this.commandBus.execute(new CreateBlogCommand(inputBlog, userId));
  }


  @ApiOperation({ summary: "Update existing Blog by id with InputModel" })
  @ApiParam({ name: "id", type: String})
  @ApiBody({ description: "Data for updating", type: InputBlogDto})
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "If user try to update blog that doesn't belong to current user" })
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param("id") blogId: string,
                   @Body() inputBlog: InputBlogDto,
                   @CurrentUserId() userId: string): Promise<void> {
    await this.commandBus.execute(new UpdateBlogCommand(blogId, inputBlog, userId));
  }


  @ApiOperation({ summary: "Delete blog specified by id" })
  @ApiParam({ name: "id", type: String, description: "Blog ID" })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param("id") blogId: string,
                   @CurrentUserId() userId: string): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(blogId, userId));
  }


  @ApiOperation({ summary: "Returns blogs (for which current user is owner) with paging" })
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
  @ApiQuery({
    name: "searchNameTerm", type: String, required: false, schema: { default: null },
    description: "Search term for blog Name: Name should contains this term in any position"
  })
  @ApiPaginatedResponse(ViewBlogDto)
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get()
  async getAllBlogs(@Query() query,
                    @Pagination() paginationParams: PaginationParams,
                    @CurrentUserId() userId: string): Promise<PaginatorDto<ViewBlogDto[]>> {
    const searchNameTerm = query.searchNameTerm as string || "";
    return this.commandBus.execute(new GetAllBlogsByUserIdCommand(searchNameTerm.trim(), paginationParams, userId));
  }


  @ApiOperation({ summary: "Create new post for specific blog" })
  @ApiParam({ name: "id", type: String, description: "Blog ID"})
  @ApiBody({ description: "Data for constructing new post entity", type: InputBlogPostDto})
  @ApiResponse({ status: 201, description: "Returns the newly created post", type: ViewPostDto })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "If user try to add post to blog that doesn't belong to current user" })
  @ApiResponse({ status: 404, description: "If specific blog doesn't exists" })
  @Post(":id/posts")
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlogId(@Param("id") blogId: string,
                           @Body() inputPost: InputBlogPostDto,
                           @CurrentUserId() userId: string): Promise<ViewPostDto> {
    return this.commandBus.execute(new CreatePostByBlogIdCommand(blogId, userId, inputPost));
  }


  @ApiOperation({ summary: "Delete post specified by id" })
  @ApiParam({ name: "blogId", type: String })
  @ApiParam({ name: "postId", type: String })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Delete(":blogId/posts/:postId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostByBlogIdAndPostId(@Param("blogId") blogId: string,
                                    @Param("postId") postId: string,
                                    @CurrentUserId() userId: string): Promise<void> {
    await this.commandBus.execute(new DeletePostByBlogIdAndPostIdCommand(blogId, postId, userId));
  }



  @ApiOperation({ summary: "Update existing post by id with InputModel" })
  @ApiParam({ name: "blogId", type: String})
  @ApiParam({ name: "postId", type: String})
  @ApiBody({ description: "Data for updating", type: InputBlogPostDto})
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "If user try to update post that belongs to blog that doesn't belong to current user" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Put(":blogId/posts/:postId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlogIdAndPostId(@Param("blogId") blogId: string,
                                    @Param("postId") postId: string,
                                    @CurrentUserId() userId: string,
                                    @Body() inputPost: InputBlogPostDto): Promise<void> {
    await this.commandBus.execute(new UpdatePostByBlogIdAndPostIdCommand(blogId, postId, userId, inputPost));
  }




  @ApiOperation({ summary: "Returns all comments for all posts inside all current user blogs" })
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
  @ApiResponse({ status: 200, type: PaginatedCommentViewDto})
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get("comments")
  async getAllComments(@Pagination() paginationParams: PaginationParams,
                       @CurrentUserId() ownerId: string): Promise<PaginatorDto<CommentViewDto[]>> {
    return this.commandBus.execute(new GetAllCommentsForMyBlogsCommand(ownerId, paginationParams));
  }
}

////////////////////////////////////////////
@ApiBasicAuth()
@ApiTags("Blogs")
@UseGuards(BaseAuthGuard)
@Controller("sa/blogs")
export class SaBlogsController {
  constructor(
    private commandBus: CommandBus) {
  }



  @ApiOperation({ summary: "Returns blogs with paging" })
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
  @ApiQuery({
    name: "searchNameTerm", type: String, required: false, schema: { default: null },
    description: "Search term for blog Name: Name should contains this term in any position"
  })
  @ApiResponse({ status: 200, description: "Success", type: PaginatedExtendedViewBlogDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get()
  async getAllBlogs(@Query() query, @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ExtendedViewBlogDto[]>> {
    const searchNameTerm = query.searchNameTerm as string || "";
    return this.commandBus.execute(new GetAllBlogsCommand(searchNameTerm.trim(), paginationParams, true));
  }


  @ApiOperation({ summary: "Bind Blog with user (if blog doesn't have an owner yet)" })
  // @ApiParam({ name: "blogId", type: String, description: "Blog ID" })
  // @ApiParam({ name: "userId ", type: String, description: "User ID" })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values or blog already bound to any user", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Put(":blogId/bind-with-user/:userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param("blogId") blogId: string, @Param("userId") userId: string): Promise<void> {
    await this.commandBus.execute(new BindBlogWithUserCommand(blogId, userId));
  }



  @ApiOperation({ summary: "Ban/unban blog" })
  @ApiParam({ name: "id", type: String , description: "Blog ID that should be banned"})
  @ApiBody({ description: "Info for update ban status", type: ViewBlogDto})
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Put(":id/ban")
  @HttpCode(HttpStatus.NO_CONTENT)
  async banBlog(@Param("id") blogId: string,
                @Body() inputBanBlogDto: InputBanBlogDto): Promise<void> {
    await this.commandBus.execute(new BanBlogCommand(blogId, inputBanBlogDto));
  }

}