import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Device } from "../security/devices.entity";

@Entity({ name: "users" })
export class User {

  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  createdAt: string;

  @Column()
  confirmationCode: string;

  @Column()
  isEmailConfirmed: boolean;

  @Column()
  recoveryCode: string;

  @Column()
  isRecoveryCodeConfirmed: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: null })
  banDate: string;

  @Column({ default: null })
  banReason: string;


  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

}