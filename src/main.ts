import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ErrorExceptionFilter, HttpExceptionFilter } from "./exception.filter";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);



  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT"));
}

bootstrap();
