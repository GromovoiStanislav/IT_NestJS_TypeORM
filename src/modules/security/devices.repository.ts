import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Device } from "./devices.entity";
import { CreateDeviceDto } from "./dto/create-device.dto";


@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(Device) private devicesRepository: Repository<Device>
  ) {
  }

  async clearAll(): Promise<void> {
    await this.devicesRepository.delete({});
  }

  async findAllByUserId(userId: string): Promise<Device[]> {
    return await this.devicesRepository.findBy({ userId });
  }

  async findByDeviceId(deviceId: string): Promise<Device | null> {
    return await this.devicesRepository.findOneBy({ deviceId });
  }

  async findByTokenId(tokenId: string): Promise<Device | null> {
    return await this.devicesRepository.findOneBy({ tokenId });
  }


  async deleteByDeviceId(deviceId: string): Promise<void> {
    await this.devicesRepository.delete({ deviceId });
  }

  async deleteByTokenId(tokenId: string): Promise<void> {
    await this.devicesRepository.delete({ tokenId });
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.devicesRepository.delete({ userId });
  }

  async deleteAllOtherExcludeDeviceId(deviceId: string, userId: string): Promise<void> {
    await this.devicesRepository
      .createQueryBuilder()
      .delete()
      .from(Device)
      //.where("userId = :userId and deviceId <> :deviceId", { userId, deviceId })
      .where({ userId: userId })
      .andWhere({ deviceId: Not(deviceId) })
      .execute();

  }


  async addOrUpdateToken(data: CreateDeviceDto): Promise<void> {
    await this.deleteByDeviceId(data.deviceId);
    await this.createByDeviceId(data);
  }

  async createByDeviceId(data: CreateDeviceDto): Promise<void> {
    await this.devicesRepository.save(data);
  }


}