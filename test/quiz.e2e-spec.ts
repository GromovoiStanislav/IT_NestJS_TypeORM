import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
//import * as request from "supertest";
import request from "supertest";

import { TypeOrmModule } from "@nestjs/typeorm";
import { QuizModule } from "../src/modules/quiz/quiz.module";
import { localDbOptions } from "../src/db/postgres.module";




describe("quiz/questions (e2e)", () => {

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(localDbOptions),
        QuizModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let id: string;
  let questions: [];

  it("Create questions [POST /sa/quiz/questions]", () => {
    return request(app.getHttpServer())
      .post("/sa/quiz/questions")
      .set("Authorization", "Basic YWRtaW46cXdlcnR5")
      .send({
        body: "question body0",
        correctAnswers: ["correct answer1", "correct answer2"]
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeDefined();
        id = body.id;
        //console.log(body);
      });
  });


  it("Create questions [PUT /sa/quiz/questions/:id/publish]", () => {
    return request(app.getHttpServer())
      .put(`/sa/quiz/questions/${id}/publish`)
      .set("Authorization", "Basic YWRtaW46cXdlcnR5")
      .send({ published: true })
      .expect(204);
  });


  it("Get all questions [GET /sa/quiz/questions]", () => {
    return request(app.getHttpServer())
      .get("/sa/quiz/questions")
      .set("Authorization", "Basic YWRtaW46cXdlcnR5")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.items.length).toBe(1)
        //console.log(body);
      });
  });


  it("Delete question by id [DELETE /sa/quiz/questions/:id/publish]", async () => {
    await request(app.getHttpServer())
        .delete(`/sa/quiz/questions/${id}`)
        .set("Authorization", "Basic YWRtaW46cXdlcnR5")
        .send({ published: true })
        .expect(204);

    await request(app.getHttpServer())
      .get("/sa/quiz/questions")
      .set("Authorization", "Basic YWRtaW46cXdlcnR5")
      .expect(200)
      .then(({ body }) => {
        expect(body.items.length).toBe(0)
      });

  });


  afterAll(async () => {
    await app.close();
  });

});
