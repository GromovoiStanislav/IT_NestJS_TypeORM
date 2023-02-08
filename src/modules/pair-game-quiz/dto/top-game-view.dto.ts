import { ApiProperty } from "@nestjs/swagger";

export class PlayerViewDto {
  @ApiProperty({ required: false, type: String })
  id: string;

  @ApiProperty({ required: false, type: String })
  login: string;
}


export class TopGamePlayerViewDto {
  @ApiProperty({ required: false, type: "integer", format: "int32", description: "Sum scores of all games" })
  sumScore: number;

  @ApiProperty({
    required: false,
    type: Number,
    format: "double",
    description: "Average score of all games rounded to 2 decimal places"
  })
  avgScores: number;

  @ApiProperty({ required: false, type: "integer", format: "int32", description: "All played games count" })
  gamesCount: number;

  @ApiProperty({ required: false, type: "integer", format: "int32" })
  winsCount: number;

  @ApiProperty({ required: false, type: "integer", format: "int32" })
  lossesCount: number;

  @ApiProperty({ required: false, type: "integer", format: "int32" })
  drawsCount: number;

  @ApiProperty({ required: false })
  player: PlayerViewDto;
}

export class TopGamePlayerDbDto {
  sumScore: number;
  avgScores: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;
  userId: string;
  userLogin: string;
}


export class PaginatorTopGamePlayerViewDto {
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pagesCount: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  page: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  pageSize: number;
  @ApiProperty({ type: "integer", format: "int32", required: false })
  totalCount: number;
  @ApiProperty({ required: false, isArray: true, type:TopGamePlayerViewDto })
  items: TopGamePlayerViewDto[];
}
