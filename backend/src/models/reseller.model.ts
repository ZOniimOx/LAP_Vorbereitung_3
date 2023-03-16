import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "resellers" })
export class Reseller {
  @PrimaryGeneratedColumn({ name: "resellerid" })
  reselerid: number;

  @Column({ name: "name", nullable: false })
  name: string;

  @Column({ name: "username" })
  username: string;

  @Column({ name: "password" })
  password: string;
}