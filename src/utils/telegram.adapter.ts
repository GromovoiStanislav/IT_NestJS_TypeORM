import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class TelegramAdapter {
  private axios: AxiosInstance
  constructor() {
    const token = process.env.TELEGRAM_TOKEN;
    this.axios = axios.create({baseURL:`https://api.telegram.org/bot${token}/`})
  }

  async sendMessage(text: string, chat_id: number) {
    await this.axios.post(`sendMessage`, { chat_id, text });
  }

  async setWebhook(url: string){
    await this.axios.post(`setWebhook`,{url:`${url}/telegram`})
  }

}

export type TelegramMessage = {
  message: {
    from: {
      id: number,
      first_name: string,
      last_name: string
    }
    text: string
  }
}

@Injectable()
export class TelegramHandles {
  constructor(private telegramAdapter: TelegramAdapter) {
  }

  async execute(payload: TelegramMessage){
    let text = payload.message.text

    if (text === '/start') {text='Привет!'}
    else if (text.toLowerCase().includes('приветик')) {text=`Привееет, ${payload.message.from.first_name}!!!`}
    else if (text.toLowerCase().includes('привет')) {text='Как дела?'}
    else if (text.toLowerCase().includes('как дела')) {text='У меня всё хорошо! А как у тебя?'}
    else if (text.toLowerCase().includes('как у тебя')) {text='У меня всё хорошо! А как у тебя?'}
    else if (text.toLowerCase().includes('здрасти')) {text='Забор покрасти ))))'}
    else if (text.toLowerCase().includes('здрасте')) {text='Забор покрасте ))))'}

    else if (text === '500-200' || text === '599-299') {text='Ну скажи 300'}
    else if (text.toLowerCase().includes('скажи 300')) {text='Не скажу ни за что'}
    else if (text.toLowerCase().includes('300')) {text='Отсоси у программиста ))))'}
    else {text='Скажи 300'}

    await this.telegramAdapter.sendMessage(text,payload.message.from.id)
  }



}
