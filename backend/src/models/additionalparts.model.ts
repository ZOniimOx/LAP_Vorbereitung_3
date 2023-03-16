import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "additionalparts" })
export class AdditionalParts {
  @PrimaryGeneratedColumn({ name: "partid" })
  partid: number;

  @Column({ name: "partname" })
  partname: string;

  @Column({ name: "price", type: "float" })
  price: number;
}
