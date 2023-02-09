import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";
import { Post } from "./post.entity";


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
    await this.postsRepository.update({ id: postId }, updatePostDto);
    // await this.postsRepository.createQueryBuilder()
    //   .update()
    //   .set({
    //     title: updatePostDto.title,
    //     content: updatePostDto.content,
    //     shortDescription: updatePostDto.shortDescription,
    //     blogId: updatePostDto.blogId,
    //     blogName: updatePostDto.blogName
    //   })
    //   .where("id = :postId", { postId })
    //   .execute();
  }


  async getOnePost(postId: string, notBan: boolean = false): Promise<Post | null> {
    if (notBan) {
      return this.postsRepository.createQueryBuilder("post")
        .innerJoin("post.blog", "blog", "blog.isBanned = false")
        //.where("post.id = :postId", { postId })
        .where({ id: postId })
        .getOne();
    } else {
      return await this.postsRepository.findOneBy({ id: postId });
    }
  }


  async getAllPostsByBlogOwnerId(ownerId: string): Promise<Post[]> {
    return this.postsRepository.createQueryBuilder("post")
      .innerJoin("post.blog", "blog")
      //.where("blog.userId = :ownerId", {ownerId})
      .where({
        blog: {
          userId: ownerId
        }
      })
      .getMany();
  }


  async getAllPosts({
                      pageNumber,
                      pageSize,
                      sortBy,
                      sortDirection
                    }: PaginationParams,
                    blogId: string): Promise<PaginatorDto<Post[]>> {

    const QB1 = this.postsRepository.createQueryBuilder("p");
    const QB2 = this.postsRepository.createQueryBuilder("p");

    QB1.select(["p.id", "p.title", "p.content", "p.shortDescription", "p.blogId", "p.blogName", "p.createdAt"]);
    QB2.select("COUNT(*)", "count");

    if (blogId) {
      // QB1.where("p.blogId = :blogId", { blogId });
      // QB2.where("p.blogId = :blogId", { blogId });
      QB1.where({ blogId });
      QB2.where({ blogId });

    }

    if (sortBy === "title") {
      sortBy = "p.title";
    } else if (sortBy === "content") {
      sortBy = "p.content";
    } else if (sortBy === "shortDescription") {
      sortBy = "p.shortDescription";
    } else if (sortBy === "blogName") {
      sortBy = "p.blogName";
    } else {
      sortBy = "p.createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    QB1
      .orderBy(sortBy, order)
      .skip(((pageNumber - 1) * pageSize))
      .take(pageSize);

    const items = await QB1.getMany();
    const resultCount = await QB2.getRawOne();
    const totalCount = +resultCount?.count || 0;

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


}