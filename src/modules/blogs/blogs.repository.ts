import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BlogBdDto } from "./dto/blog-bd.dto";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { BlogOwnerDto } from "./dto/blog-owner.dto";
import { BanBlogInfo } from "./dto/blog-banInfo.dto";
import { CreateBlogBanUserDto } from "./dto/create-blog-ban-user.dto";
import { BlogBannedUserBdDto } from "./dto/blog-banned-users-bd.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { Blog } from "./blog.entity";
import { BlogBannedUser } from "./blog-banned-users.entity";
import { User } from "../users/user.entity";


@Injectable()
export class BlogsRepository {

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
    @InjectRepository(BlogBannedUser) private blogBannedUsersRepository: Repository<BlogBannedUser>
  ) {
  }


  async clearAll(): Promise<void> {
    await this.blogsRepository.delete({});
    // await Promise.all([
    //await this.blogBannedUsersRepository.delete({});
    // ]);
  }


  async getAllBlogs(searchName: string, {
                      pageNumber,
                      pageSize,
                      sortBy,
                      sortDirection
                    }: PaginationParams,
                    includeBanned: boolean,
                    userId?: string): Promise<PaginatorDto<BlogBdDto[]>> {

    if (!["name", "websiteUrl", "description", "createdAt", "userLogin"].includes(sortBy)) {
      sortBy = "createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    let filter = `WHERE 1=1`;
    if (!includeBanned) {
      filter = filter + ` and "isBanned" = false`;
    }
    if (userId) {
      filter = filter + ` and "userId" = '${userId}'`;
    }
    if (searchName) {
      filter = filter + ` and "name" ~* '${searchName}'`;
    }

    const items = await this.dataSource.query(`
    SELECT "id", "name", "websiteUrl", "description", "createdAt", "userId", "userLogin", "isBanned", "banDate"
    FROM public."blogs"
    ${filter}
    ORDER BY "${sortBy}" COLLATE "C" ${order}
    LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize};
    `);


    let totalCount = 0;
    const resultCount = await this.dataSource.query(`
    SELECT COUNT(*)
    FROM public."blogs"
    ${filter};
    `);
    if (resultCount.length > 0) {
      totalCount = +resultCount[0].count;
    }

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


  async deleteBlog(id: string): Promise<number> {
    const result = await this.blogsRepository.delete({ id });
    return result.affected;
  }


  async getOneBlog(id: string): Promise<Blog | null> {
    return await this.blogsRepository.findOneBy({ id, isBanned: false });
  }


  async createBlog(createBlogDto: CreateBlogDto): Promise<Blog> {
    return await this.blogsRepository.save(createBlogDto);
  }


  async updateBlog(blogId: string, updateBlogDto: UpdateBlogDto): Promise<void> {
    await this.blogsRepository.createQueryBuilder()
      .update(Blog)
      .set({ name: updateBlogDto.name, websiteUrl: updateBlogDto.websiteUrl, description: updateBlogDto.description })
      .where("id = :blogId", { blogId })
      .execute();
  }


  async bindBlogWithUser(blogId: string, blogOwner: BlogOwnerDto): Promise<void> {
    await this.blogsRepository.createQueryBuilder()
      .update(Blog)
      .set({ userId: blogOwner.userId, userLogin: blogOwner.userLogin })
      .where("id = :blogId", { blogId })
      .execute();
  }


  async banBlog(blogId: string, banInfo: BanBlogInfo): Promise<void> {
    await this.blogsRepository.createQueryBuilder()
      .update(Blog)
      .set({ isBanned: banInfo.isBanned, banDate: banInfo.banDate })
      .where("id = :blogId", { blogId })
      .execute();
  }


  async getBanedBlogs(): Promise<Blog[]> {
    return await this.blogsRepository.findBy({ isBanned: true });
  }


  //////////////////////////////////////////////////////

  async banUserForBlog(createBlogBanUserDto: CreateBlogBanUserDto): Promise<void> {
    await this.dataSource.query(`
    INSERT INTO public."blogBannedUsers"(
    "blogId", "userId", "login", "createdAt", "banReason")
    VALUES ($1, $2, $3, $4, $5);
    `, [
      createBlogBanUserDto.blogId,
      createBlogBanUserDto.userId,
      createBlogBanUserDto.login,
      createBlogBanUserDto.createdAt,
      createBlogBanUserDto.banReason
    ]);

  }

  async unbanUserForBlog(userId: string, blogId: string): Promise<void> {
    await this.dataSource.query(`
    DELETE FROM public."blogBannedUsers"
    WHERE "userId" = $1 and "blogId" = $2;
    `, [userId, blogId]);

  }

  async findBannedUserForBlog(blogId: string, userId: string): Promise<BlogBannedUserBdDto | null> {
    const result = await this.dataSource.query(`
    SELECT "blogId", "userId", "login", "createdAt", "banReason"
    FROM public."blogBannedUsers"
    WHERE "blogId" = $1 and "userId" = $2;
    `, [blogId, userId]);

    if (result.length > 0) {
      return result[0];
    }
    return null;
  }


  async getAllBannedUsersForBlog(
    blogId: string,
    searchLogin: string,
    {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    }: PaginationParams): Promise<PaginatorDto<BlogBannedUserBdDto[]>> {

    if (!["login", "banReason", "createdAt"].includes(sortBy)) {
      sortBy = "createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    let filter = `WHERE "blogId" = $1`;
    if (searchLogin) {
      filter = filter + ` and "login" ~* '${searchLogin}'`;
    }

    const items = await this.dataSource.query(`
    SELECT "blogId", "userId", "login", "createdAt", "banReason"
    FROM public."blogBannedUsers"
    ${filter}
    ORDER BY "${sortBy}" COLLATE "C" ${order}
    LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize};
    `, [blogId]);


    let totalCount = 0;
    const resultCount = await this.dataSource.query(`
    SELECT COUNT(*)
    FROM public."blogBannedUsers"
    ${filter};
    `, [blogId]);
    if (resultCount.length > 0) {
      totalCount = +resultCount[0].count;
    }

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


}