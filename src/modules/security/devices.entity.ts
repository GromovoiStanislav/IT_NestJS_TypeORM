import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity({ name: "devices" })
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tokenId: string;

  @Column()
  deviceId: string;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: "CASCADE" })
  user: User;
  @Column()
  userId: string;

  @Column()
  issuedAt: string;

  @Column()
  expiresIn: string;

  @Column()
  ip: string;

  @Column()
  title: string;
}