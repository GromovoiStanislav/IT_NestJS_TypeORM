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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";


@ApiTags('Comments')
@Controller("comments")
export class CommentsController {

  constructor(
    private commandBus: CommandBus) {
  }


  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AuthUserIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param("id") commentId: string,
                      @CurrentUserId() userId: string): Promise<void> {
    await this.commandBus.execute(new DeleteCommentCommand(commentId, userId));
  }


  @ApiBearerAuth()
  @Put(":id")
  @UseGuards(AuthUserIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(@Param("id") commentId: string,
                      @CurrentUserId() userId: string,
                      @Body() inputComment: InputCommentDto): Promise<void> {
    await this.commandBus.execute(new UpdateCommentCommand(commentId, userId, inputComment));
  }


  @ApiBearerAuth()
  @Put(":id/like-status")
  @UseGuards(AuthUserIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentLikeStatus(@Param("id") commentId: string,
                      @CurrentUserId() userId: string,
                      @Body() inputLike: InputLikeDto): Promise<void> {
    await this.commandBus.execute(new UpdateCommentLikeCommand(commentId, userId, inputLike.likeStatus));
  }


  @Get(":id")
  async getComment(@Param("id") commentId: string, @CurrentUserId() userId: string) {
    return this.commandBus.execute(new GetCommentCommand(commentId, userId));
  }


}
