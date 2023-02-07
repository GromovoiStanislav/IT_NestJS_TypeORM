import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Quiz } from "./quiz.entity";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { PaginatorDto } from "../../common/dto/paginator.dto";
import { PublishQuizDto } from "./dto/publish-quiz.dto";


@Injectable()
export class QuizzesRepository {

  constructor(
    @InjectRepository(Quiz) private quizzesRepository: Repository<Quiz>
  ) {
  }


  async clearAll(): Promise<void> {
    await this.quizzesRepository.delete({});
  }


  async deleteQuiz(id: string): Promise<number> {
    const result = await this.quizzesRepository.delete({ id });
    return result.affected;
  }


  async findQuiz(id: string): Promise<Quiz> {
    return await this.quizzesRepository.findOneBy({ id });
  }

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    return await this.quizzesRepository.save(createQuizDto);
  }

  async updateQuiz(id: string, updateQuizDto: UpdateQuizDto): Promise<number> {
    const result = await this.quizzesRepository.update({ id }, updateQuizDto);
    return result.affected;
  }

  async updatePublishQuiz(id: string, updatePublishDto: PublishQuizDto): Promise<number> {
    const result = await this.quizzesRepository.update({ id }, updatePublishDto);
    return result.affected;
  }

  async get5Quizzes(): Promise<Quiz[]> {
    // return await this.quizzesRepository.find({
    //   select: ["id", "body", "correctAnswers"],
    //   where: { published: true },
    //   take: 5
    // });
    //{id:true,body:true,correctAnswers:true}
    return await this.quizzesRepository
      .createQueryBuilder("q")
      .select(["q.id", "q.body", "q.correctAnswers"])
      .where("q.published = true")
      .orderBy("RANDOM()")
      .take(5)
      .getMany();

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