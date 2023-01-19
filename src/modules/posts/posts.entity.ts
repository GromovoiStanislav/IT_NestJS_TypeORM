import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ManyToOne } from "typeorm";
import { Blog } from "../blogs/blog.entity";
import { PostLike } from "./post-likes.entity";

@Entity({ name: "posts" })
export class Post {

  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  shortDescription: string;

  @ManyToOne(() => Blog, (blog) => blog.posts, { onDelete: "CASCADE" })
  blog: Blog;
  @Column()
  blogId: string;

  @Column()
  blogName: string;

  @Column()
  createdAt: string;

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];


}
