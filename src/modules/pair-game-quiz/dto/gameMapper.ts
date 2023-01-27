import { Game } from "../game.entity";
import { GamePairViewDto } from "./game-pair-view.dto";
import { PaginatorDto } from "../../../commonDto/paginator.dto";


export default class GameMapper {

  static fromModelToView(game: Game): GamePairViewDto {
    const viewGame = new GamePairViewDto();
    viewGame.id = game.id;
    viewGame.status = game.status;
    viewGame.pairCreatedDate = game.pairCreatedDate;
    viewGame.startGameDate = game.startGameDate;
    viewGame.finishGameDate = game.finishGameDate;

    if (Array.isArray(game.questions)) {
      viewGame.questions = game.questions.map(q => ({ id: q.id, body: q.body }));
    } else {
      viewGame.questions = null;
    }


    viewGame.firstPlayerProgress = {
      player: {
        id: game.firstPlayerId,
        login: game.firstPlayerLogin
      },
      score: game.firstPlayerScore,
      answers: game.firstPlayerAnswers
    };

    if (game.secondPlayerId === null) {
      viewGame.secondPlayerProgress = null;
    } else {
      viewGame.secondPlayerProgress = {
        player: {
          id: game.secondPlayerId,
          login: game.secondPlayerLogin
        },
        score: game.secondPlayerScore,
        answers: game.secondPlayerAnswers
      };
    }

    return viewGame;
  }


  static fromModelsToPaginator(quizzes: PaginatorDto<Game[]>): PaginatorDto<GamePairViewDto[]> {
    return {
      pagesCount: quizzes.pagesCount,
      page: quizzes.page,
      pageSize: quizzes.pageSize,
      totalCount: quizzes.totalCount,
      items: quizzes.items.map(game => this.fromModelToView(game))
    };
  }


}