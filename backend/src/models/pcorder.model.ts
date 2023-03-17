import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PC } from "./pc.model";
import { Order } from "./order.model";
import { AdditionalParts } from "./additionalparts.model";

@Entity({ name: "pcorders" })
export class PCOrder {
  @PrimaryGeneratedColumn({ name: "pcorderid" })
  pcorderid: number;

  @Column({ name: "quantity" })
  quantity: number;

  @JoinColumn({ name: "pcid" })
  @ManyToOne(() => PC, (pc) => pc.pcorders)
  pc: PC;

  @JoinColumn({ name: "orderid" })
  @ManyToOne(() => Order, (order) => order.pcorders, { onDelete: "CASCADE" })
  order: Order;

  @ManyToMany(() => AdditionalParts)
  @JoinTable({
    name: "pcorderadditionalparts",
    joinColumn: { name: "pcorderid" },
    inverseJoinColumn: { name: "partid" },
  })
  additionalparts: AdditionalParts[];
}
