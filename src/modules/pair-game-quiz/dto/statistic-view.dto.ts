import { ApiProperty } from "@nestjs/swagger";

export class StatisticViewDto {
  @ApiProperty({
    required: false, description: "Sum scores of all games",
    type: "integer", format: "int32"
  })
  sumScore: number;

  @ApiProperty({
    required: false, description: "Average score of all games rounded to 2 decimal places",
    type: Number, format: "double"
  })
  avgScores: number;

  @ApiProperty({
    required: false, description: "All played games count",
    type: "integer", format: "int32"
  })
  gamesCount: number;


  @ApiProperty({
    required: false, type: "integer", format: "int32"
  })
  winsCount: number;

  @ApiProperty({
    required: false, type: "integer", format: "int32"
  })
  lossesCount: number;


  @ApiProperty({
    required: false, type: "integer", format: "int32"
  })
  drawsCount: number;
}