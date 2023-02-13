import { NestFactory } from "@nestjs/core";
import ngrok from "ngrok";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ErrorExceptionFilter, HttpExceptionFilter } from "./exception.filter";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PaginatorDto } from "./common/dto/paginator.dto";


import {  createWriteStream } from 'fs';
import { get } from 'http';

//import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });//для кастомного валидатора!!!
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    //forbidNonWhitelisted: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      const errorsForResponse = [];
      errors.forEach(e => {
        Object.keys(e.constraints).forEach(key => {
          errorsForResponse.push({ field: e.property, message: e.constraints[key] });
        });
      });
      throw new BadRequestException(errorsForResponse);
    }
  }));
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter());


  const config = new DocumentBuilder()
    .setTitle('It-blogs')
    .setDescription('The it-blogs API description')
    .setVersion('1.0')
    .addBasicAuth()
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [PaginatorDto],
  });
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get("PORT")
  await app.listen(PORT);

  // if (configService.get<string>("NODE_ENV").toLowerCase() === "development"){
  //   const url = await ngrok.connect(PORT)
  //   console.log(url);
  // }





  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {
      const serverUrl = 'http://localhost:3000'

    // write swagger ui files
    get(
      `${serverUrl}/api/swagger-ui-bundle.js`, function
      (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      });

    get(`${serverUrl}/api/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
    });

    get(
      `${serverUrl}/api/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-standalone-preset.js'));
      });

    get(`${serverUrl}/api/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    });

  }


}

bootstrap();
