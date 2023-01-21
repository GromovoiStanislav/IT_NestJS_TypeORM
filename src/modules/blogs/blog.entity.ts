import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "../users/user.entity";
import { BlogBannedUser } from "./blog-banned-users.entity";
import { Post } from "../posts/post.entity";

@Entity({ name: "blogs" })
export class Blog {

  @PrimaryColumn()
  id: string;

  // ALTER TABLE public.blogs
  // ALTER COLUMN name TYPE character varying COLLATE pg_catalog."C";
  @Column({ collation: 'C'})
  name: string;

  @Column()
  websiteUrl: string;

  @Column()
  description: string;

  @Column()
  createdAt: string;

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: "SET NULL" })
  user: User;
  @Column({ nullable: true })
  userId: string;

  @Column()
  userLogin: string;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: null })
  banDate: string;


  @OneToMany(() => BlogBannedUser, (bannedForBlog) => bannedForBlog.blog)
  bannedForUsers: BlogBannedUser[];

  @OneToMany(() => Post, (post) => post.blog)
  posts: Post[];

}
