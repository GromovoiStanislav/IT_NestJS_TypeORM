import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "../modules/users/user.entity";
import { Quiz } from "../modules/quiz/quiz.entity";
import { Post } from "../modules/posts/post.entity";
import { PostLike } from "../modules/posts/post-like.entity";
import { Comment } from "../modules/comments/comment.entity";
import { CommentLike } from "../modules/comments/comment-like.entity";
import { Blog } from "../modules/blogs/blog.entity";
import { BlogBannedUser } from "../modules/blogs/blog-banned-users.entity";
import { Device } from "../modules/security/devices.entity";


export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  //url:  process.env.PG_URL,
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "It_blog",
  synchronize: false,
  entities: [User, Device, Quiz, Blog, BlogBannedUser, Post, PostLike, Comment, CommentLike],
  migrations: [__dirname + "/migrations/*.ts"]
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;