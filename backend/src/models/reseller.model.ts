import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.model";

@Entity({ name: "resellers" })
export class Reseller {
  @PrimaryGeneratedColumn({ name: "resellerid" })
  reselerid: number;

  @Column({ name: "name", nullable: false })
  name: string;

  @OneToOne(() => User, (user) => user.reseller)
  user: User;
}
