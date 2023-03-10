import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "quizzes" })
export class Quiz {

  @PrimaryColumn()
  id: string;

  @Column({ collation: "C" })
  body: string;

  @Column({ type: "jsonb" })
  correctAnswers: string[];

  @Column({ default: false })
  published: boolean;

  @Column()
  createdAt: string;

  @Column({ default: null })
  updatedAt: string;

}
