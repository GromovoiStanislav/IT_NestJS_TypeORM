import {
  Body,
  Controller,
  Delete, Get,
  HttpCode,
  HttpStatus,
  Param, Put,
  UseGuards
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  DeleteCommentCommand,
  GetCommentCommand,
  UpdateCommentCommand,
  UpdateCommentLikeCommand
} from "./comments.service";
import { CurrentUserId } from "../../common/decorators/current-userId.decorator";
import { InputCommentDto } from "./dto/input-comment.dto";
import { AuthUserIdGuard } from "../../common/guards/auth.userId.guard";
import { InputLikeDto } from "./dto/input-like.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { APIErrorResult } from "../../common/dto/errors-message.dto";
import { ViewCommentDto } from "./dto/view-comment.dto";

//////////////////////////////////////////////////////////////////////////////

@ApiTags('Comments')
@Controller("comments")
export class CommentsController {

  constructor(
    private commandBus: CommandBus) {
  }


  @ApiOperation({ summary: "Delete comment specified by id" })
  @ApiParam({ name: "commentId", description: "Comment id", type: String })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "If try delete the comment that is not your own" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @UseGuards(AuthUserIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @Delete(":commentId")
  async deleteComment(@Param("commentId") commentId: string,
                      @CurrentUserId() userId: string): Promise<void> {
    await this.commandBus.execute(new DeleteCommentCommand(commentId, userId));
  }



  @ApiOperation({ summary: "Delete comment specified by id" })
  @ApiParam({ name: "commentId", description: "Comment id", type: String })
  @ApiBody({ required: true, description: "Data for updating", type: InputCommentDto })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "If try edit the comment that is not your own" })
  @ApiResponse({ status: 404, description: "Not Found" })
  @ApiBearerAuth()
  @UseGuards(AuthUserIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(":commentId")
  async updateComment(@Param("commentId") commentId: string,
                      @CurrentUserId() userId: string,
                      @Body() inputComment: InputCommentDto): Promise<void> {
    await this.commandBus.execute(new UpdateCommentCommand(commentId, userId, inputComment));
  }



  @ApiOperation({ summary: "Make like/unlike/dislike/undislike operation" })
  @ApiParam({ name: "commentId", description: "Comment id", type: String })
  @ApiBody({ required: true, description: "Like model for make like/dislike/reset operation", type: InputLikeDto })
  @ApiResponse({ status: 204, description: "No Content" })
  @ApiResponse({ status: 400, description: "If the inputModel has incorrect values", type: APIErrorResult })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "If comment with specified id doesn't exists" })
  @ApiBearerAuth()
  @UseGuards(AuthUserIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(":commentId/like-status")
  async updateCommentLikeStatus(@Param("commentId") commentId: string,
                      @CurrentUserId() userId: string,
                      @Body() inputLike: InputLikeDto): Promise<void> {
    await this.commandBus.execute(new UpdateCommentLikeCommand(commentId, userId, inputLike.likeStatus));
  }



  @ApiOperation({ summary: "Return comment by id" })
  @ApiParam({ name: "id", description: "Id of existing comment", type: String })
  @ApiResponse({ status: 200, description: "Success", type: ViewCommentDto })
  @ApiResponse({ status: 404, description: "Not Found" })
  @Get(":id")
  async getComment(@Param("id") commentId: string, @CurrentUserId() userId: string): Promise<ViewCommentDto> {
    return this.commandBus.execute(new GetCommentCommand(commentId, userId));
  }


}
