import { Brackets, DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { BanUsersInfo } from "./dto/user-banInfo.dto";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";
import { User } from "./user.entity";


@Injectable()
export class UsersRepository {

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


  async findUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ recoveryCode });
  }


  async getBanedUsers(): Promise<User[]> {
    return await this.usersRepository.findBy({ isBanned: true });
  }


  async findUserByLoginOrEmail(search: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder("users")
      .where("users.login = :login OR users.email = :email", { login: search, email: search })
      .getOne();
  }

  async findUserByLoginOrEmail_v2(login: string, email: string): Promise<User | null> {
    return this.usersRepository.findOneBy([{ login }, { email }]);

  }


  async findUserByConfirmationCode(confirmationCode: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ confirmationCode });
  }


  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(createUserDto);
  }


  async banUser(userId: string, banInfo: BanUsersInfo): Promise<void> {
    await this.usersRepository.update({ id: userId }, banInfo);
    // await this.usersRepository.createQueryBuilder()
    //   .update(User)
    //   .set({ isBanned: banInfo.isBanned, banDate: banInfo.banDate, banReason: banInfo.banReason })
    //   .where("id = :userId", { userId })
    //   .execute();
  }


  async confirmUser(userId: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { isEmailConfirmed: true });
    // await this.usersRepository.createQueryBuilder()
    //   .update(User)
    //   .set({ isEmailConfirmed: true })
    //   .where("id = :userId", { userId })
    //   .execute();
  }


  async updateUser(user: User): Promise<void> {
    await this.usersRepository.save(user)
  }


  async updateConfirmCode(userId: string, confirmationCode: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { confirmationCode });
    // await this.usersRepository.createQueryBuilder()
    //   .update(User)
    //   .set({ confirmationCode })
    //   .where("id = :userId", { userId })
    //   .execute();
  }

  async updateRecoveryCode(email: string, recoveryCode: string): Promise<void> {
    await this.usersRepository.update({ email }, { recoveryCode, isRecoveryCodeConfirmed: false });
  }


  async getAllUsers(banStatus: string,
                    searchLogin: string,
                    searchEmail: string, {
                      pageNumber,
                      pageSize,
                      sortBy,
                      sortDirection
                    }: PaginationParams): Promise<PaginatorDto<User[]>> {

    const QB1 = this.usersRepository.createQueryBuilder("u");
    const QB2 = this.usersRepository.createQueryBuilder("u");

    QB1.select(["u.id", "u.login", "u.email", "u.createdAt", "u.isBanned", "u.banDate", "u.banReason"]);
    QB2.select("COUNT(*)", "count");

    if (searchLogin && searchEmail) {
      QB1.where(
        new Brackets((qb) => {
          qb.where("u.login ~* :searchLogin", { searchLogin })
            .orWhere("u.email ~* :searchEmail", { searchEmail });
        })
      );
      QB2.where(
        new Brackets((qb) => {
          qb.where("u.login ~* :searchLogin OR u.email ~* :searchEmail", { searchLogin, searchEmail });
        })
      );

    } else if (searchLogin) {
      QB1.where("u.login ~* :searchLogin", { searchLogin });
      QB2.where("u.login ~* :searchLogin", { searchLogin });

    } else if (searchEmail) {
      QB1.where("u.email ~* :searchEmail", { searchEmail });
      QB2.where("u.email ~* :searchEmail", { searchEmail });
    }

    if (banStatus === "notBanned") {
      QB1.andWhere("u.isBanned = false");
      QB2.andWhere("u.isBanned = false");
    } else if (banStatus === "banned") {
      QB1.andWhere("u.isBanned = true");
      QB2.andWhere("u.isBanned = true");
    }


    if (sortBy === "login") {
      sortBy = "u.login";
    } else if (sortBy === "email") {
      sortBy = "u.email";
    } else {
      sortBy = "u.createdAt";
    }
    const order = sortDirection === "asc" ? "ASC" : "DESC";

    QB1
      .orderBy(sortBy, order)
      .skip(((pageNumber - 1) * pageSize))
      .take(pageSize);

    // console.log(QB1.getQuery());
    // console.log(QB2.getSql());

    const items = await QB1.getMany();
    const resultCount = await QB2.getRawOne();
    const totalCount = +resultCount?.count || 0;

    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    return { pagesCount, page, pageSize, totalCount, items };
  }


}