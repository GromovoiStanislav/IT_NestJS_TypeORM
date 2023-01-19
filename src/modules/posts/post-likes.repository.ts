import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ExtendedLikesInfoDto } from "../../commonDto/extendedLikesInfoDto";
import { LikeDetailsViewDto } from "../../commonDto/likeDetailsViewDto";
import { PostLike } from "./post-likes.entity";


@Injectable()
export class PostLikesPgPawRepository {

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(PostLike) private postLikesRepository: Repository<PostLike>
  ) {
  }

  async clearAll(): Promise<void> {
    await this.postLikesRepository.delete({});
  }


  async deleteByPostIDUserID(postId: string, userId: string): Promise<void> {
    await this.postLikesRepository.delete({ postId, userId });
  }


  async findCommentLike(postId: string, userId: string): Promise<PostLike | null> {
    return await this.postLikesRepository.findOneBy({ postId, userId });
  }


  async createCommentLike(postId: string, userId: string, userLogin: string, likeStatus: string): Promise<void> {
    const addedAt = new Date().toISOString();
    await this.postLikesRepository.save({
      postId,
      userId,
      userLogin,
      likeStatus,
      addedAt
    });
  }


  async updateCommentLike(postId: string, userId: string, userLogin: string, likeStatus: string): Promise<void> {
    const addedAt = new Date().toISOString();

    await this.postLikesRepository.createQueryBuilder()
      .update()
      .set({
        postId,
        userId,
        userLogin,
        likeStatus,
        addedAt
      })
      .where("postId = :postId AND userId = :", { postId, userId })
      .execute();
  }


  async likesInfoByPostIDs(postIds: string[], userId: string): Promise<ExtendedLikesInfoDto[]> {
    try {
      const result = await this.dataSource.query(`
    WITH not_banned_likes AS ( 
        SELECT "postId", "userId", "likeStatus" FROM public."postLikes"
        WHERE "postId"= ANY ($1) and "userId" in (
        SELECT "id"
        FROM public."users"
        WHERE "isBanned" = false
        )
    )
    SELECT 
     "postId",
    (SELECT count(*) FROM not_banned_likes WHERE "likeStatus"='Like' AND "postId"=nb."postId") as "likesCount",
    (SELECT count(*) FROM not_banned_likes WHERE "likeStatus"='Dislike' AND "postId"=nb."postId") as "dislikesCount",
    (SELECT "likeStatus" FROM public."postLikes" WHERE "postId"=nb."postId" AND "userId"=$2 LIMIT 1) as "myStatus"
     FROM "not_banned_likes" as nb;
    `, [postIds, userId]);

      const newestLikes = await this.newestLikes(postIds);

      return result.map(i => ({
          postId: i.postId,
          likesCount: +i.likesCount,
          dislikesCount: +i.dislikesCount,
          myStatus: i.myStatus ? i.myStatus : "None",
          newestLikes: newestLikes.filter(el => el.postId === i.postId)
        }
      ));

    } catch (e) {
      return [];
    }
  }


  async newestLikes(postIds: string[]): Promise<LikeDetailsViewDto[]> {
    const result = await this.dataSource.query(`
    SELECT 
    t."postId",t."userId",t."userLogin",t."addedAt", t."RN"
    FROM ( 
        SELECT "postId", "userId","userLogin","addedAt",
        ROW_NUMBER() OVER(PARTITION BY "postId" ORDER BY "addedAt" DESC) as "RN" 
        FROM public."postLikes"
        WHERE "postId"= ANY ($1) and "likeStatus"='Like' and "userId" in (
            SELECT "id"
            FROM public."users"
            WHERE "isBanned" = false
            )
        ) as t
    WHERE t."RN"<4
    ;
    `, [postIds]);


    return result.map(el => ({
      postId: el.postId,
      addedAt: el.addedAt,
      userId: el.userId,
      login: el.userLogin
    }));
  }


}