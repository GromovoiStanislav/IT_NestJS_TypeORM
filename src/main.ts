import { NestFactory } from "@nestjs/core";
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
  SwaggerModule.setup('swagger', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT"));

  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {
      const serverUrl = 'http://localhost:3000'

    // write swagger ui files
    get(
      `${serverUrl}/swagger/swagger-ui-bundle.js`, function
      (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
        console.log(
          `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
        );
      });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(
      `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      });

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });

  }


}

bootstrap();
