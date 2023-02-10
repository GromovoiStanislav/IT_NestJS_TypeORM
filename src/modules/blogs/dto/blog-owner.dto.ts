import { ApiProperty } from "@nestjs/swagger";

export class BlogOwnerDto {
  @ApiProperty({ type: String, required: false, nullable: true,
    description: "Id of owner of the blog" })
  userId: string

  @ApiProperty({ type: String, required: false, nullable:true,
    description: "Login of owner of the blog" })
  userLogin: string
}