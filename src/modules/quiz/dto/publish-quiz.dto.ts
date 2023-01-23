import { IsBoolean, IsNotEmpty } from "class-validator";

export class PublishQuizDto {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
