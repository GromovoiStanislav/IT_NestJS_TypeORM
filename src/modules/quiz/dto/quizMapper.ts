import { InputQuizDto } from "./input-quiz.dto";
import { CreateQuizDto } from "./create-quiz.dto";
import dateAt from "../../../utils/DateGenerator";
import { Quiz } from "../quiz.entity";
import { ViewQuizDto } from "./view-quiz.dto";
import { PaginatorDto } from "../../../commonDto/paginator.dto";
import { UpdateQuizDto } from "./update-quiz.dto";
import { InputPublishQuizDto } from "./input-publish-quiz.dto";
import { PublishQuizDto } from "./publish-quiz.dto";


export default class QuizMapper {

  static fromInputToCreate(inputQuiz: InputQuizDto): CreateQuizDto {
    const quiz = new CreateQuizDto();
    //user.id = uid();
    quiz.body = inputQuiz.body;
    quiz.correctAnswers = inputQuiz.correctAnswers;
    quiz.published = false;
    quiz.createdAt = dateAt();
    quiz.updatedAt = null;
    return quiz;
  }

  static fromInputToUpdate(inputQuiz: InputQuizDto): UpdateQuizDto {
    const quiz = new UpdateQuizDto();
    quiz.body = inputQuiz.body;
    quiz.correctAnswers = inputQuiz.correctAnswers;
    quiz.updatedAt = dateAt();
    return quiz;
  }

  static fromInputToUpdatePublish(inputQuiz: InputPublishQuizDto): PublishQuizDto {
    const quiz = new PublishQuizDto();
    quiz.published = inputQuiz.published;
    quiz.updatedAt = dateAt();
    return quiz;
  }


  static fromModelToView(quiz: Quiz): ViewQuizDto {
    const viewQuiz = new ViewQuizDto();
    viewQuiz.id = quiz.id;
    viewQuiz.body = quiz.body;
    viewQuiz.correctAnswers = quiz.correctAnswers;
    viewQuiz.published = quiz.published;
    viewQuiz.createdAt = quiz.createdAt;
    viewQuiz.updatedAt = quiz.updatedAt;
    return viewQuiz;
  }

  static fromModelsToPaginator(quizzes: PaginatorDto<Quiz[]>): PaginatorDto<ViewQuizDto[]> {
    return {
      pagesCount: quizzes.pagesCount,
      page: quizzes.page,
      pageSize: quizzes.pageSize,
      totalCount: quizzes.totalCount,
      items: quizzes.items.map(quiz => QuizMapper.fromModelToView(quiz))
    };
  }


}