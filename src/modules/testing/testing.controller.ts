import { Controller, Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { DeleteAllDataCommand  } from "./testing.service";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Testing')
@Controller("testing")
export class TestingController {
  constructor(private commandBus: CommandBus) {
  }

  @Delete("all-data")
  @HttpCode(HttpStatus.NO_CONTENT)//204
  async deleteAllData() {
    return this.commandBus.execute(new DeleteAllDataCommand());
  }

}