import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "../users/user.entity";
import { BlogBannedUser } from "./blog-banned-users.entity";

@Entity({ name: "blogs" })
export class Blog {

  @PrimaryColumn()
  id: string;

  @Column()
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

}
