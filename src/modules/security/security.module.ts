import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SecurityController } from "./security.controller";
import {
  AddOrUpdateDeviceSessionUseCase,
  ClearAllDevicesUseCase,
  FindSessionByTokenIdUseCase,
  KillAllSessionsByUserIdUseCase,
  KillSessionByDeviceIdUseCase,
  KillSessionByTokenIdUseCase,
  ReturnAllDeviceSessionsByCurrentUserUseCase,
  TerminateAllOtherDeviceSessionsExcludeCurrentUserUseCase,
  TerminateDeviceSessionUseCase
} from "./security.service";
import { JWT_Module } from "../jwt/jwt.module";
import { DevicesRepository } from "./devices.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Device } from "./devices.entity";



const useCases = [
  ClearAllDevicesUseCase,
  ReturnAllDeviceSessionsByCurrentUserUseCase,
  TerminateAllOtherDeviceSessionsExcludeCurrentUserUseCase,
  TerminateDeviceSessionUseCase,
  AddOrUpdateDeviceSessionUseCase,
  KillSessionByDeviceIdUseCase,
  FindSessionByTokenIdUseCase,
  KillSessionByTokenIdUseCase,
  KillAllSessionsByUserIdUseCase
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),CqrsModule, JWT_Module,
  ],
  controllers: [SecurityController],
  providers: [...useCases,DevicesRepository]
})
export class SecurityModule {
}
