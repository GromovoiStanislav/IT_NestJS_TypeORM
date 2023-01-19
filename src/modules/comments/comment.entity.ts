import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Post } from "../posts/post.entity";
import { User } from "../users/user.entity";
import { CommentLike } from "./comment-like.entity";


@Entity({ name: "comments" })
export class Comment {

  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  post: Post;
  @Column()
  postId: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
  user: User;
  @Column()
  userId: string;

  @Column()
  userLogin: string;

  @Column()
  createdAt: string;

  @OneToMany(() => CommentLike, (like) => like.comment)
  likes: CommentLike[];

}
