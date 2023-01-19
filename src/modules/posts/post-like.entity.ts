import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "../users/user.entity";

@Entity({ name: "postLikes" })
export class PostLike {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: "CASCADE" })
  post: Post;
  @Column()
  postId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;
  @Column()
  userId: string;

  @Column()
  userLogin: string;

  @Column()
  likeStatus: string;

  @Column()
  addedAt: string;
}
