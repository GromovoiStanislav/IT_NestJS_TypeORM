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
  @ManyToOne(() => User,{ onDelete: "SET NULL" })
  firstPlayer: User;
  @Column()
  firstPlayerId: string;

  @Column()
  firstPlayerLogin: string;

  @Column({ default: 0 })
  firstPlayerScore: number;

  @Column({ type: "json", default: [] })
  firstPlayerAnswers: { questionId: string, answerStatus: AnswerStatus, addedAt: string }[]



  //////////////// secondPlayer /////////////////
  @ManyToOne(() => User, { onDelete: "SET NULL" })
  secondPlayer: User;
  @Column({ nullable: true })
  secondPlayerId: string;

  @Column({ nullable: true })
  secondPlayerLogin: string;

  @Column({ default: 0 })
  secondPlayerScore: number;

  @Column({ type: "json", default: [] })
  secondPlayerAnswers: { questionId: string, answerStatus: AnswerStatus, addedAt: string }[]

  ////////////////////////////////////

  @Column({ type: "json", default: [] })
  correctAnswers: { id: string, body: string }[];


  @Column({ type: "enum", enum: StatusGame, default: StatusGame.PendingSecondPlayer })
  status: StatusGame;

  @Column()
  pairCreatedDate: string;

  @Column({ nullable: true })
  startGameDate: string;

  @Column({ nullable: true })
  finishGameDate: string;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  winner: User;
  @Column({ nullable: true })
  winnerId: string;


}