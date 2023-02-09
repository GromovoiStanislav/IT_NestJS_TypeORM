import { DataSource, Like, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { BlogOwnerDto } from "./dto/blog-owner.dto";
import { BanBlogInfo } from "./dto/blog-banInfo.dto";
import { CreateBlogBanUserDto } from "./dto/create-blog-ban-user.dto";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";
import { Blog } from "./blog.entity";
import { BlogBannedUser } from "./blog-banned-users.entity";


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
    await this.blogsRepository.update({ id: blogId }, updateBlogDto);
    // await this.blogsRepository.createQueryBuilder()
    //   .update(Blog)
    //   .set({ name: updateBlogDto.name, websiteUrl: updateBlogDto.websiteUrl, description: updateBlogDto.description })
    //   .where("id = :blogId", { blogId })
    //   .execute();
  }


  async bindBlogWithUser(blogId: string, blogOwner: BlogOwnerDto): Promise<void> {
    await this.blogsRepository.update({ id: blogId }, blogOwner);
    // await this.blogsRepository.createQueryBuilder()
    //   .update(Blog)
    //   .set({ userId: blogOwner.userId, userLogin: blogOwner.userLogin })
    //   .where("id = :blogId", { blogId })
    //   .execute();
  }


  async banBlog(blogId: string, banInfo: BanBlogInfo): Promise<void> {
    await this.blogsRepository.update({ id: blogId }, banInfo);
    // await this.blogsRepository.createQueryBuilder()
    //   .update(Blog)
    //   .set({ isBanned: banInfo.isBanned, banDate: banInfo.banDate })
    //   .where("id = :blogId", { blogId })
    //   .execute();
  }


  async getBanedBlogs(): Promise<Blog[]> {
    return await this.blogsRepository.findBy({ isBanned: true });
  }


  //////////////////////////////////////////////////////

  async banUserForBlog(createBlogBanUserDto: CreateBlogBanUserDto): Promise<void> {
    await this.blogBannedUsersRepository.save(createBlogBanUserDto);
  }

  async unbanUserForBlog(userId: string, blogId: string): Promise<void> {
    await this.blogBannedUsersRepository.delete({ userId, blogId });
  }

  async findBannedUserForBlog(blogId: string, userId: string): Promise<BlogBannedUser | null> {
    return await this.blogBannedUsersRepository.findOneBy({ blogId, userId });
  }


  /////////////////////////////////////////////////////////////

  async getAllBlogs(searchName: string, {
                      pageNumber,
                      pageSize,
                      sortBy,
                      sortDirection
                    }: PaginationParams,
                    includeBanned: boolean,
                    userId?: string): Promise<PaginatorDto<Blog[]>> {

    const QB1 = this.blogsRepository.createQueryBuilder("b");
    const QB2 = this.blogsRepository.createQueryBuilder("b");

    QB1.select(["b.id", "b.name", "b.websiteUrl", "b.description", "b.createdAt", "b.userId", "b.userLogin", "b.isBanned", "b.banDate"]);
    QB2.select("COUNT(*)::int", "count");

    QB1.where("1 = 1");
    QB2.where("1 = 1");

    if (!includeBanned) {
      //QB1.andWhere("b.isBanned = false");
      QB1.andWhere({isBanned: false});
      //QB2.andWhere("b.isBanned = false");
      QB2.andWhere({isBanned: false});
    }
    if (userId) {
      //QB1.andWhere("b.userId = :userId", { userId });
      QB1.andWhere({ userId });
      //QB2.andWhere("b.userId = :userId", { userId });
      QB2.andWhere({ userId });
    }
    if (searchName) {
      //QB1.andWhere("b.name ~* :searchName", { searchName });
      QB1.andWhere( { name: Like(`%${searchName}%`) });
      //QB2.andWhere("b.name ~* :searchName", { searchName });
      QB2.andWhere( { name: Like(`%${searchName}%`) });
    }

    if (sortBy === "name") {
      sortBy = "b.name";
    } else if (sortBy === "websiteUrl") {
      sortBy = "b.websiteUrl";
    } else if (sortBy === "description") {
      sortBy = "b.description";
    } else if (sortBy === "userLogin") {
      sortBy = "b.userLogin";
    } else {
      sortBy = "b.createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    QB1
      .orderBy(sortBy, order)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    QB1
      .orderBy(sortBy, order)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    const items = await QB1.getMany();
    const resultCount = await QB2.getRawOne();
    //const totalCount = +resultCount?.count || 0;
    const totalCount = resultCount.count;

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


  async getAllBannedUsersForBlog(
    blogId: string,
    searchLogin: string,
    {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    }: PaginationParams): Promise<PaginatorDto<BlogBannedUser[]>> {

    const QB1 = this.blogBannedUsersRepository.createQueryBuilder("bbu");
    const QB2 = this.blogBannedUsersRepository.createQueryBuilder("bbu");

    QB1.select(["bbu.blogId", "bbu.userId", "bbu.login", "bbu.createdAt", "bbu.banReason"]);
    QB2.select("COUNT(*)::int", "count");

    //QB1.where("bbu.blogId = :blogId", { blogId });
    QB1.where({ blogId });
    //QB2.where("bbu.blogId = :blogId", { blogId });
    QB2.where({ blogId });

    if (searchLogin) {
      //QB1.andWhere("bbu.login ~* :searchLogin", { searchLogin });
      QB1.andWhere( { login: Like(`%${searchLogin}%`) });
      //QB2.andWhere("bbu.login ~* :searchLogin", { searchLogin });
      QB2.andWhere( { login: Like(`%${searchLogin}%`) });
    }


    if (sortBy === "login") {
      sortBy = "bbu.login";
    } else if (sortBy === "banReason") {
      sortBy = "bbu.banReason";
    } else {
      sortBy = "bbu.createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    QB1
      .orderBy(sortBy, order)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    const items = await QB1.getMany();
    const resultCount = await QB2.getRawOne();
    //const totalCount = +resultCount?.count || 0;
    const totalCount = resultCount.count;

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


}