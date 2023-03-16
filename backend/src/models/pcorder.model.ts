import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PC } from "./pc.model";
import { Order } from "./order.model";

@Entity({ name: "pcorders" })
export class PCOrder {
  @PrimaryGeneratedColumn({ name: "pcorderid" })
  pcorderid: number;

  @JoinColumn({ name: "pcid" })
  @ManyToOne(() => PC, (pc) => pc.pcorders)
  pc: PC;

  @JoinColumn({ name: "orderid" })
  @ManyToOne(() => Order, (order) => order.pcorders)
  order: Order;
}
