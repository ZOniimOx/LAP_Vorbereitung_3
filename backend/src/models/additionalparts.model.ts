import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PCOrder } from "./pcorder.model";

@Entity({ name: "additionalparts" })
export class AdditionalParts {
  @PrimaryGeneratedColumn({ name: "partid" })
  partid: number;

  @Column({ name: "partname" })
  partname: string;

  @Column({ name: "price", type: "float" })
  price: number;

  @ManyToMany(() => PCOrder)
  @JoinTable({
    name: "pcorderadditionalparts",
    joinColumn: { name: "partid" },
    inverseJoinColumn: { name: "pcorderid" },
  })
  pcorders: PCOrder[];
}
