import { Controller, Delete, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { DeleteAllDataCommand } from "./testing.service";
import { CommandBus } from "@nestjs/cqrs";
import { ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Get5QuestionsCommand } from "../quiz/quiz.service";

@ApiTags("Testing")
@Controller("testing")
export class TestingController {
  constructor(private commandBus: CommandBus) {
  }

  @ApiOperation({ summary: "Clear database: delete all data from all tables/collections" })
  @ApiResponse({ status: 204, description: "All data is deleted" })
  @Delete("all-data")
  @HttpCode(HttpStatus.NO_CONTENT)//204
  async deleteAllData() {
    return this.commandBus.execute(new DeleteAllDataCommand());
  }

  @ApiExcludeEndpoint()
  @Get("test")
  async test() {
    return await this.commandBus.execute(new Get5QuestionsCommand());
  }
}