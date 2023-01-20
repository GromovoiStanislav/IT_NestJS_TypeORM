import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { Comment } from "./comment.entity";


@Injectable()
export class CommentsRepository {

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>
  ) {
  }


  async clearAll(): Promise<void> {
    await this.commentsRepository.delete({});
  }


  async deleteComment(id: string): Promise<void> {
    await this.commentsRepository.delete({ id });
  }


  async findComment(commentId: string): Promise<Comment | null> {
    return await this.commentsRepository.findOneBy({ id: commentId });
  }


  async findCommentWithLikes(commentId: string, userId: string) {
    const result = await this.dataSource.query(`
    SELECT "id","postId","content","userId","userLogin","createdAt",
    l."likesCount", l."dislikesCount", l."myStatus"

    FROM public."comments"
    join (
    WITH not_banned_likes AS ( 
        SELECT "commentId", "userId", "likeStatus" FROM public."commentLikes"
        WHERE "commentId"=$1 and "userId" in (
        SELECT "id"
        FROM public."users"
        WHERE "isBanned" = false
    )
    )
    SELECT 
    (SELECT count(*) FROM not_banned_likes WHERE "likeStatus"='Like') as "likesCount",
    (SELECT count(*) FROM not_banned_likes WHERE "likeStatus"='Dislike') as "dislikesCount",
    (SELECT "likeStatus" FROM public."commentLikes" WHERE "commentId"=$1 and "userId"=$2 LIMIT 1) as "myStatus"
    ) l ON true=true

    WHERE "id" = $1
    `, [commentId, userId]);

    if (result.length > 0) {
      return result[0];
    }
    return null;

  }


  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto): Promise<void> {
    await this.commentsRepository.update({ id: commentId }, updateCommentDto);
    // await this.commentsRepository.createQueryBuilder()
    //   .update()
    //   .set(updateCommentDto)
    //   .where("id = :commentId", { commentId })
    //   .execute();
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    return await this.commentsRepository.save(createCommentDto);
  }


  async getAllComments({
                         pageNumber,
                         pageSize,
                         sortBy,
                         sortDirection
                       }: PaginationParams,
                       postId: string): Promise<PaginatorDto<Comment[]>> {

    //return { pagesCount:99, page:99, pageSize:99, totalCount:99, items:[] };

    if (sortBy === "content") {
      sortBy = "c.content";
    } else if (sortBy === "userLogin") {
      sortBy = "c.userLogin";
    } else {
      sortBy = "c.createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    const items = await this.commentsRepository.createQueryBuilder("c")
      .select(["c.id", "c.postId", "c.content", "c.userId", "c.userLogin", "c.createdAt"])
      .where("c.postId = :postId", { postId })
      .orderBy(sortBy, order)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getMany();

    const resultCount = await this.commentsRepository.createQueryBuilder("c")
      .select("COUNT(*)", "count")
      .where("c.postId = :postId", { postId })
      .getRawOne();
    const totalCount = +resultCount?.count || 0;

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


  async getAllCommentsByArrayOfPosts({
                                       pageNumber,
                                       pageSize,
                                       sortBy,
                                       sortDirection
                                     }: PaginationParams,
                                     postsIds: string[]): Promise<PaginatorDto<Comment[]>> {

    if (sortBy === "content") {
      sortBy = "c.content";
    } else if (sortBy === "userLogin") {
      sortBy = "c.userLogin";
    } else {
      sortBy = "c.createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    const items = await this.commentsRepository.createQueryBuilder("c")
      .select(["c.id", "c.postId", "c.content", "c.userId", "c.userLogin", "c.createdAt"])
      .where("c.postId IN (:...postsIds)", { postsIds })
      .orderBy(sortBy, order)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getMany();

    const resultCount = await this.commentsRepository.createQueryBuilder("c")
      .select("COUNT(*)", "count")
      .where("c.postId IN (:...postsIds)", { postsIds })
      .getRawOne();
    const totalCount = +resultCount?.count || 0;

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


}