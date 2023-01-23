import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "quizzes" })
export class Quiz {

  @PrimaryGeneratedColumn()
  id: string;

  @Column({ collation: 'C'})
  body: string;

  @Column({ type: "json" })
  correctAnswers: string[];

  @Column({ default: false })
  published: boolean;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

}
