import { IsBoolean, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InputPublishQuizDto {
  @ApiProperty({
    type: Boolean,
    required: true,
    description: `True if question is completed and can be used in the Quiz game`
  })
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
