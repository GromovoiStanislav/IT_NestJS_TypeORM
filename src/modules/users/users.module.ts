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
  GetUserByIdUseCase, GetUserByLoginOrEmail_v2UseCase,
  GetUserByLoginOrEmailUseCase, GetUserByRecoveryCodeUseCase,
  UpdateConfirmCodeUseCase, UpdatePasswordRecoveryCodeUseCase, UpdatePasswordUseCase
} from "./users.service";
import { CqrsModule } from "@nestjs/cqrs";
import { JWT_Module } from "../jwt/jwt.module";
import { UsersRepository } from "./users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";

const useCases = [
  ClearAllUsersUseCase,
  FindAllUsersUseCase,
  DeleteUserUseCase,
  CreateUserUseCase,
  GetUserByLoginOrEmailUseCase,
  GetUserByLoginOrEmail_v2UseCase,
  UpdateConfirmCodeUseCase,
  GetUserByConfirmationCodeUseCase,
  ConfirmUserUseCase,
  GetUserByIdUseCase,
  BanUserUserUseCase,
  GetIdBannedUsersUseCase,
  UpdatePasswordRecoveryCodeUseCase,
  GetUserByRecoveryCodeUseCase,
  UpdatePasswordUseCase
];

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule, JWT_Module],
  controllers: [SaUsersController, BloggerUsersController],
  providers: [...useCases, UsersRepository]
})
export class UsersModule {
}