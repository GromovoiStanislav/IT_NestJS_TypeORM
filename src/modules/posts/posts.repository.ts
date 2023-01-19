import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { Post } from "./posts.entity";


@Injectable()
export class PostsRepository {

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Post) private postsRepository: Repository<Post>
  ) {
  }


  async clearAll(): Promise<void> {
    await this.postsRepository.delete({});
  }


  async deletePost(id: string): Promise<number> {
    const result = await this.postsRepository.delete({ id });
    return result.affected;
  }


  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    return await this.postsRepository.save(createPostDto);
  }


  async updatePost(postId: string, updatePostDto: UpdatePostDto): Promise<void> {
    await this.postsRepository.createQueryBuilder()
      .update()
      .set({
        title: updatePostDto.title,
        content: updatePostDto.content,
        shortDescription: updatePostDto.shortDescription,
        blogId: updatePostDto.blogId,
        blogName: updatePostDto.blogName
      })
      .where("id = :postId", { postId })
      .execute();
  }


  async getOnePost(postId: string, notBan: boolean = false): Promise<Post | null> {

    if (notBan) {
      return this.postsRepository.createQueryBuilder("post")
        .innerJoin("post.blog", "blog", "blog.isBanned = false")
        .where("user.id = :postId", { postId })
        .getOne()

    //   const result = await this.dataSource.query(`
    //     SELECT "id", "title", "content", "shortDescription", "blogId", "blogName", "createdAt"
    //     FROM public."posts"
    //     WHERE "id" = $1 and "blogId" in (
    //     SELECT "id"
    //     FROM public."blogs"
    //     WHERE "isBanned" = false);
    // `, [postId]);
    //
    //   if (result.length > 0) {
    //     return result[0];
    //   }
    //   return null;

    } else {
      return await this.postsRepository.findOneBy({ id: postId });
    }


  }


  async getAllPostsByBlogOwnerId(ownerId: string): Promise<Post[]> {
    return this.dataSource.query(`
    SELECT "id", "title", "content", "shortDescription", "blogId", "blogName", "createdAt"
    FROM public."posts"
    WHERE "blogId" in (
        SELECT "id"
        FROM public."blogs"
        WHERE "userId" = $1
    );
    `, [ownerId]);
  }


  async getAllPosts({
                      pageNumber,
                      pageSize,
                      sortBy,
                      sortDirection
                    }: PaginationParams, blogId: string): Promise<PaginatorDto<Post[]>> {

    if (!["title", "content", "shortDescription", "blogName", "createdAt"].includes(sortBy)) {
      sortBy = "createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    let filter = "";
    if (blogId) {
      filter = `WHERE "blogId" = '${blogId}'`;
    }

    const items = await this.dataSource.query(`
    SELECT "id", "title", "content", "shortDescription", "blogId", "blogName", "createdAt"
    FROM public."posts"
    ${filter}
    ORDER BY "${sortBy}" COLLATE "C" ${order}
    LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize};
    `);


    let totalCount = 0;
    const resultCount = await this.dataSource.query(`
    SELECT COUNT(*)
    FROM public."posts"
    ${filter};
    `);
    if (resultCount.length > 0) {
      totalCount = +resultCount[0].count;
    }


    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


}