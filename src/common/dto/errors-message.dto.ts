import { ApiProperty } from "@nestjs/swagger";

export class FieldError {
  @ApiProperty({
    type: String,
    description: "Message with error explanation for certain field",
    nullable: true,
    required: false
  })
  message: string;
  @ApiProperty({
    type: String,
    description: "What field/property of input model has error",
    nullable: true,
    required: false
  })
  field: string;
}

export class APIErrorResult {
  @ApiProperty({
    type: FieldError,
    isArray: true.valueOf(),
    nullable: true,
    required: false
  })
  errorsMessages: FieldError[];
}

