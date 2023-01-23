import { IsBoolean, IsNotEmpty } from "class-validator";

export class InputPublishQuizDto {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
