import { Brackets, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Quiz } from "./quiz.entity";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { PublishQuizDto } from "./dto/publish-quiz.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { User } from "../users/user.entity";

@Injectable()
export class QuizzesRepository {

  constructor(
    @InjectRepository(Quiz) private quizzesRepository: Repository<Quiz>
  ) {
  }


  async clearAll(): Promise<void> {
    await this.quizzesRepository.delete({});
  }


  async deleteQuiz(id: number): Promise<number> {
    const result = await this.quizzesRepository.delete({ id });
    return result.affected;
  }


  async findQuiz(id: number): Promise<Quiz> {
    return await this.quizzesRepository.findOneBy({ id });

  }

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    return await this.quizzesRepository.save(createQuizDto);
  }

  async updateQuiz(id: number, updateQuizDto: UpdateQuizDto): Promise<number> {
    const result = await this.quizzesRepository.update({ id }, updateQuizDto);
    return result.affected;
  }

  async updatePublishQuiz(id: number, updatePublishDto: PublishQuizDto): Promise<number> {
    const result = await this.quizzesRepository.update({ id }, updatePublishDto);
    return result.affected;
  }

  async getAllQuizzes(
    bodySearchTerm: string,
    publishedStatus: string, {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    }: PaginationParams): Promise<PaginatorDto<Quiz[]>> {


    const QB1 = this.quizzesRepository.createQueryBuilder("q");
    const QB2 = this.quizzesRepository.createQueryBuilder("q");

    QB1.select(["q.id", "q.body", "q.correctAnswers", "q.createdAt", "q.updatedAt", "q.published"]);
    QB2.select("COUNT(*)", "count");


    QB1.where("1 = 1");
    QB2.where("1 = 1");

    if (bodySearchTerm) {
      QB1.andWhere("q.body ~* :bodySearchTerm", { bodySearchTerm });
      QB2.andWhere("q.body ~* :bodySearchTerm", { bodySearchTerm });
    }

    if (publishedStatus === "notPublished") {
      QB1.andWhere("q.published = false");
      QB2.andWhere("q.published = false");
    } else if (publishedStatus === "published") {
      QB1.andWhere("q.published = true");
      QB2.andWhere("q.published = true");
    }


    if (sortBy === "body") {
      sortBy = "q.body";
    } else if (sortBy === "updatedAt") {
      sortBy = "q.updatedAt";
    } else {
      sortBy = "q.createdAt";
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