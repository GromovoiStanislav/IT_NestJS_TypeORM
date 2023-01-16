import { Module } from "@nestjs/common";
import { BloggerUsersController, SaUsersController } from "./users.controller";
import {
  BanUserUserUseCase,
  ClearAllUsersUseCase,
  ConfirmUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase, GetIdBannedUsersUseCase,
  GetUserByConfirmationCodeUseCase,
  GetUserByIdUseCase,
  GetUserByLoginOrEmailUseCase,
  UpdateConfirmCodeUseCase
} from "./users.service";
import { CqrsModule } from "@nestjs/cqrs";
import { JWT_Module } from "../jwt/jwt.module";
import { UsersPgPawRepository } from "./users-pg-paw-repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";

const useCases = [
  ClearAllUsersUseCase,
  FindAllUsersUseCase,
  DeleteUserUseCase,
  CreateUserUseCase,
  GetUserByLoginOrEmailUseCase,
  UpdateConfirmCodeUseCase,
  GetUserByConfirmationCodeUseCase,
  ConfirmUserUseCase,
  GetUserByIdUseCase,
  BanUserUserUseCase,
  GetIdBannedUsersUseCase
];

@Module({
  imports: [TypeOrmModule.forFeature([User]),CqrsModule, JWT_Module],
  controllers: [SaUsersController, BloggerUsersController],
  providers: [...useCases, UsersPgPawRepository]
})
export class UsersModule {
}