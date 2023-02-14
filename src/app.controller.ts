import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeController, ApiExcludeEndpoint } from "@nestjs/swagger";
import { TelegramHandles, TelegramMessage } from "./utils/telegram.adapter";


@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private telegramHandles: TelegramHandles) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiExcludeEndpoint()
  @Post("/telegram")
  async telegram(@Body() body: TelegramMessage) {
    await this.telegramHandles.execute(body)
  }

}




