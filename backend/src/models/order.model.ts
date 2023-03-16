import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Reseller } from "./reseller.model";
import { PCOrder } from "./pcorder.model";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn({ name: "orderid" })
  orderid: number;

  @Column({ name: "orderdate", type: "date", nullable: false })
  orderdate: Date;

  @JoinColumn({ name: "resellerid" })
  @ManyToOne(() => Reseller)
  reseller: Reseller;

  @OneToMany(() => PCOrder, (pcorder) => pcorder.order)
  pcorders: PCOrder;
}
