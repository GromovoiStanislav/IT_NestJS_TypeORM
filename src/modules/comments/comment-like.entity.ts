import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Comment } from "./comment.entity";

@Entity({ name: "commentLikes" })
export class CommentLike {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, comment => comment.likes, { onDelete: "CASCADE" })
  comment: Comment;
  @Column()
  commentId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;
  @Column()
  userId: string;

  @Column()
  likeStatus: string;
}
