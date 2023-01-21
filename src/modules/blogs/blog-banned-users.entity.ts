import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Blog } from "./blog.entity";

@Entity({ name: "blogBannedUsers" })
export class BlogBannedUser {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blog, { onDelete: "CASCADE" })
  blog: Blog;
  @Column()
  blogId: string;


  @ManyToOne(() => User, (user) => user.bannedForBlogs, { onDelete: "CASCADE" })
  user: User;
  @Column()
  userId: string;

  // ALTER TABLE public.blogBannedUsers
  // ALTER COLUMN login TYPE character varying COLLATE pg_catalog."C";
  @Column({collation: 'C'})
  login: string;

  @Column()
  createdAt: string;

  @Column()
  banReason: string;

}
