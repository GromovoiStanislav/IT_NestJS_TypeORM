import { InputUserDto } from "./dto/input-user.dto";
import { PaginationParams } from "../../common/dto/paginationParams.dto";
import { generateHash } from "../../utils/bcryptUtils";
import UsersMapper from "./dto/usersMapper";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InputBanUserDto } from "./dto/input-ban-user.dto";
import { BanUsersInfo } from "./dto/user-banInfo.dto";
import dateAt from "../../utils/DateGenerator";
import { KillAllSessionsByUserIdCommand } from "../security/security.service";
import { UsersRepository } from "./users.repository";
import { NotFoundException } from "@nestjs/common";
import { User } from "./user.entity";


//////////////////////////////////////////////////////////////
export class ClearAllUsersCommand {
  constructor() {
  }
}

@CommandHandler(ClearAllUsersCommand)
export class ClearAllUsersUseCase implements ICommandHandler<ClearAllUsersCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: ClearAllUsersCommand) {
    await this.usersRepository.clearAll();
  }
}

////////////////////////////////////////////////////
export class FindAllUsersCommand {
  constructor(public banStatus: string, public searchLogin: string, public searchEmail: string, public paginationParams: PaginationParams) {
  }
}

@CommandHandler(FindAllUsersCommand)
export class FindAllUsersUseCase implements ICommandHandler<FindAllUsersCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: FindAllUsersCommand) {
    const result = await this.usersRepository.getAllUsers(command.banStatus, command.searchLogin, command.searchEmail, command.paginationParams);
    return UsersMapper.fromModelsToPaginator(result);
  }
}


////////////////////////////////////////////////////////////
export class DeleteUserCommand {
  constructor(public userId: string) {
  }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: DeleteUserCommand) {
    const result = await this.usersRepository.deleteUser(command.userId);
    if (!result) {
      throw new NotFoundException();
    }
  }
}

////////////////////////////////////////////////////////////
export class CreateUserCommand {
  constructor(public inputUser: InputUserDto, public confirmationCode: string) {
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: CreateUserCommand) {
    const createUser = UsersMapper.fromInputToCreate(command.inputUser, command.confirmationCode);
    createUser.password = await generateHash(createUser.password);
    return UsersMapper.fromModelToView(await this.usersRepository.createUser(createUser));
  }
}

////////////////////////////////////////////////////////////
export class GetUserByLoginOrEmailCommand {
  constructor(public search: string) {
  }
}

@CommandHandler(GetUserByLoginOrEmailCommand)
export class GetUserByLoginOrEmailUseCase implements ICommandHandler<GetUserByLoginOrEmailCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: GetUserByLoginOrEmailCommand) {
    return await this.usersRepository.findUserByLoginOrEmail(command.search);
  }
}

////////////////////////////////////////////////////////////
export class GetUserByLoginOrEmail_v2Command {
  constructor(public login: string, public email: string) {
  }
}

@CommandHandler(GetUserByLoginOrEmail_v2Command)
export class GetUserByLoginOrEmail_v2UseCase implements ICommandHandler<GetUserByLoginOrEmail_v2Command> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: GetUserByLoginOrEmail_v2Command) {
    return await this.usersRepository.findUserByLoginOrEmail_v2(command.login, command.email);
  }
}


////////////////////////////////////////////////////////////
export class GetUserByIdCommand {
  constructor(public userId: string) {
  }
}

@CommandHandler(GetUserByIdCommand)
export class GetUserByIdUseCase implements ICommandHandler<GetUserByIdCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: GetUserByIdCommand): Promise<User | null> {
    return await this.usersRepository.findUserById(command.userId);
  }
}


////////////////////////////////////////////////////////////
export class UpdateConfirmCodeCommand {
  constructor(public userId: string, public confirmationCode: string) {
  }
}

@CommandHandler(UpdateConfirmCodeCommand)
export class UpdateConfirmCodeUseCase implements ICommandHandler<UpdateConfirmCodeCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: UpdateConfirmCodeCommand) {
    await this.usersRepository.updateConfirmCode(command.userId, command.confirmationCode);
  }
}

////////////////////////////////////////////////////////////
export class GetUserByConfirmationCodeCommand {
  constructor(public confirmationCode: string) {
  }
}

@CommandHandler(GetUserByConfirmationCodeCommand)
export class GetUserByConfirmationCodeUseCase implements ICommandHandler<GetUserByConfirmationCodeCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: GetUserByConfirmationCodeCommand) {
    return await this.usersRepository.findUserByConfirmationCode(command.confirmationCode);
  }
}


////////////////////////////////////////////////////////////
export class ConfirmUserCommand {
  constructor(public userId: string) {
  }
}

@CommandHandler(ConfirmUserCommand)
export class ConfirmUserUseCase implements ICommandHandler<ConfirmUserCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: ConfirmUserCommand) {
    return await this.usersRepository.confirmUser(command.userId);
  }
}


////////////////////////////////////////////////////////////
export class BanUserCommand {
  constructor(public userId: string, public inputBanUser: InputBanUserDto) {
  }
}

@CommandHandler(BanUserCommand)
export class BanUserUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    private commandBus: CommandBus,
    private usersRepository: UsersRepository) {
  }

  async execute(command: BanUserCommand) {

    const banInfo = new BanUsersInfo();
    if (command.inputBanUser.isBanned) {
      banInfo.isBanned = true;
      banInfo.banDate = dateAt();
      banInfo.banReason = command.inputBanUser.banReason;
    }

    await this.usersRepository.banUser(command.userId, banInfo);
    await this.commandBus.execute(new KillAllSessionsByUserIdCommand(String(command.userId)));

  }
}

////////////////////////////////////////////////////
export class GetIdBannedUsersCommand {
  constructor() {
  }
}

@CommandHandler(GetIdBannedUsersCommand)
export class GetIdBannedUsersUseCase implements ICommandHandler<GetIdBannedUsersCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: GetIdBannedUsersCommand): Promise<string[]> {
    const users = await this.usersRepository.getBanedUsers();
    return users.map(user => user.id);
  }
}

////////////////////////////////////////////////////////////
export class UpdatePasswordRecoveryCodeCommand {
  constructor(public email: string, public recoveryCode: string) {
  }
}

@CommandHandler(UpdatePasswordRecoveryCodeCommand)
export class UpdatePasswordRecoveryCodeUseCase implements ICommandHandler<UpdatePasswordRecoveryCodeCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: UpdatePasswordRecoveryCodeCommand): Promise<void> {
    await this.usersRepository.updateRecoveryCode(command.email, command.recoveryCode);
  }
}