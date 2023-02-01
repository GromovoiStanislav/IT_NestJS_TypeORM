import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { LikesInfoDto } from "../../common/dto/likesInfoDto";
import { CommentLike } from "./comment-like.entity";



@Injectable()
export class CommentLikesRepository {

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(CommentLike) private commentLikesRepository: Repository<CommentLike>
  ) {
  }

  async clearAll(): Promise<void> {
    await this.commentLikesRepository.delete({});
  }

  async deleteCommentLike(commentId: string, userId: string): Promise<void> {
    await this.commentLikesRepository.delete({ commentId, userId });
  }


  async findCommentLike(commentId: string, userId: string): Promise<CommentLike | null> {
    return await this.commentLikesRepository.findOneBy({ commentId, userId });
  }


  async createCommentLike(commentId: string, userId: string, likeStatus: string): Promise<void> {
    await this.commentLikesRepository.save({
      commentId,
      userId,
      likeStatus,
    });
  }


  async updateCommentLike(commentId: string, userId: string, likeStatus: string): Promise<void> {
    await this.commentLikesRepository.update({commentId,userId},{ likeStatus })
    // await this.commentLikesRepository.createQueryBuilder()
    //   .update()
    //   .set({ likeStatus })
    //   .where("commentId = :commentId AND userId = :", { commentId, userId })
    //   .execute();
  }




  async likesByCommentID(commentIds: string[], userId: string): Promise<LikesInfoDto[]> {

    try {

      const result = await this.dataSource.query(`
    WITH "not_banned_likes" AS (
    SELECT "commentId", "likeStatus"
    FROM public."commentLikes"
    WHERE "commentId" = ANY ($1) AND "userId" in (
         SELECT "id"
         FROM public."users"
         WHERE "isBanned" = false
         )
    )
    SELECT 
    "commentId",
    (SELECT count(*) FROM not_banned_likes WHERE "likeStatus"='Like' AND "commentId"=nb."commentId") as "likesCount",
    (SELECT count(*) FROM not_banned_likes WHERE "likeStatus"='Dislike' AND "commentId"=nb."commentId") as "dislikesCount",
    (SELECT "likeStatus" FROM public."commentLikes" WHERE "commentId"=nb."commentId" AND "userId"=$2 LIMIT 1) as "myStatus"
     FROM "not_banned_likes" as nb;
    `, [commentIds, userId]);

      return result.map(i => ({
          commentId: i.commentId,
          likesCount: +i.likesCount,
          dislikesCount: +i.dislikesCount,
          myStatus: i.myStatus ? i.myStatus : "None"
        }
      ));

    } catch (e) {
      return [];
    }
  }


}