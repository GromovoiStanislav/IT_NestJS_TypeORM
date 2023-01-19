import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Device } from "../security/devices.entity";
import { Blog } from "../blogs/blog.entity";
import { BlogBannedUser } from "../blogs/blog-banned-users.entity";
import { Comment } from "../comments/comment.entity";

@Entity({ name: "users" })
export class User {

  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  createdAt: string;

  @Column()
  confirmationCode: string;

  @Column()
  isEmailConfirmed: boolean;

  @Column()
  recoveryCode: string;

  @Column()
  isRecoveryCodeConfirmed: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: null })
  banDate: string;

  @Column({ default: null })
  banReason: string;


  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @OneToMany(() => BlogBannedUser, (bannedForBlog) => bannedForBlog.user)
  bannedForBlogs: BlogBannedUser[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

}