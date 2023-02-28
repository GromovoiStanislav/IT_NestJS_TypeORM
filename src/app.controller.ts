import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeController, ApiExcludeEndpoint } from "@nestjs/swagger";
import { TelegramHandleUseCase, TelegramMessage } from "./utils/telegram.adapter";


@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private telegramHandles: TelegramHandleUseCase) {
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

  @Post("/length")
  @HttpCode(200)
  length(@Body() body: string[]) {
    return body.map(n => ({
      name: n,
      length: new Blob([n]).size
    }));
  }


}




