import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { BanUsersInfo } from "./dto/user-banInfo.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
//import { UserBdDto } from "./dto/user-bd.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { User } from "./user.entity";


@Injectable()
export class UsersPgPawRepository {

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {
  }


  async clearAll(): Promise<void> {
    await this.usersRepository.delete({});
  }

  async deleteUser(id: string): Promise<number> {
    const result = await this.usersRepository.delete({ id });
    return result.affected;
  }


  async getAllUsers(banStatus: string,
                    searchLogin: string,
                    searchEmail: string, {
                      pageNumber,
                      pageSize,
                      sortBy,
                      sortDirection
                    }: PaginationParams): Promise<PaginatorDto<User[]>> {


    if (!["login", "email", "createdAt"].includes(sortBy)) {
      sortBy = "createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    let filter = "";
    if (searchLogin && searchEmail) {
      filter = `WHERE ("login" ~* '${searchLogin}' or "email" ~* '${searchEmail}')`;
    } else if (searchLogin) {
      filter = `WHERE "login" ~* '${searchLogin}'`;
    } else if (searchEmail) {
      filter = `WHERE "email" ~* '${searchEmail}'`;
    }

    if (["notBanned", "banned"].includes(banStatus)) {
      if (filter !== "") {
        if (banStatus === "banned") {
          filter = filter + ` AND "isBanned" = true`;
        } else if (banStatus === "notBanned") {
          filter = filter + ` AND "isBanned" = false`;
        }
      } else {
        if (banStatus === "banned") {
          filter = `WHERE "isBanned" = true`;
        } else if (banStatus === "notBanned") {
          filter = `WHERE "isBanned" = false`;
        }
      }
    }


    const items = await this.dataSource.query(`
    SELECT "login", "password", "email", "createdAt", "confirmationCode", "isEmailConfirmed", "recoveryCode", "isRecoveryCodeConfirmed", "isBanned", "banDate", "banReason", "id"
    FROM public."users"
    ${filter}
    ORDER BY "${sortBy}" COLLATE "C" ${order}
    LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize};
    `);


    let totalCount = 0;
    const resultCount = await this.dataSource.query(`
    SELECT COUNT(*)
    FROM public."users"
    ${filter};
    `);
    if (resultCount.length > 0) {
      totalCount = +resultCount[0].count;
    }


    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


  async findUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }


  async getBanedUsers(): Promise<User[]> {
    return await this.usersRepository.findBy({ isBanned: true });
  }


  async findUserByLoginOrEmail(search): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder("user")
      .where("user.login = :id OR user.email = :email", { login: search, email: search })
      .getOne();
  }


  async findUserByConfirmationCode(confirmationCode: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ confirmationCode });
  }


  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(createUserDto);
  }


  async banUser(userId: string, banInfo: BanUsersInfo): Promise<void> {
    await this.usersRepository.createQueryBuilder()
      .update(User)
      .set({ isBanned: banInfo.isBanned, banDate: banInfo.banDate, banReason: banInfo.banReason })
      .where("id = :userId", { userId })
      .execute();
  }


  async confirmUser(userId: string): Promise<void> {
    await this.usersRepository.createQueryBuilder()
      .update(User)
      .set({ isEmailConfirmed: true })
      .where("id = :userId", { userId })
      .execute();
  }


  async updateConfirmCode(userId: string, confirmationCode: string): Promise<void> {
    await this.usersRepository.createQueryBuilder()
      .update(User)
      .set({ confirmationCode })
      .where("id = :userId", { userId })
      .execute();
  }


}