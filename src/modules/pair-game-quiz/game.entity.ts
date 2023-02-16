import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

export enum StatusGame {
  PendingSecondPlayer = "PendingSecondPlayer",
  Active = "Active",
  Finished = "Finished",
}

export enum AnswerStatus {
  Correct = "Correct",
  Incorrect = "Incorrect",
}

@Entity({ name: "games" })
export class Game {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  ////////////////// firstPlayer //////////////////
  @ManyToOne(() => User)
  firstPlayer: User;
  @Column()
  firstPlayerId: string;

  @Column()
  firstPlayerLogin: string;

  @Column({ default: 0 })
  firstPlayerScore: number;

  @Column({ type: "jsonb", default: [] })
  firstPlayerAnswers: { questionId: string, answerStatus: AnswerStatus, addedAt: string }[];

  //////////////// secondPlayer /////////////////
  @ManyToOne(() => User)
  secondPlayer: User;
  @Column({ nullable: true })
  secondPlayerId: string;

  @Column({ nullable: true })
  secondPlayerLogin: string;

  @Column({ default: 0 })
  secondPlayerScore: number;

  @Column({ type: "jsonb", default: [] })
  secondPlayerAnswers: { questionId: string, answerStatus: AnswerStatus, addedAt: string }[];

  ////////////////////////////////////

  @Column({ type: "jsonb", nullable: true})
  questions: { id: string, body: string, correctAnswers: string[] }[];


  @Column({ type: "enum", enum: StatusGame, default: StatusGame.PendingSecondPlayer })
  status: StatusGame;

  @Column()
  pairCreatedDate: string;

  @Column({ nullable: true })
  startGameDate: string;

  @Column({ nullable: true })
  finishGameDate: string;

  @ManyToOne(() => User)
  winner: User;
  @Column({ nullable: true })
  winnerId: string;


}