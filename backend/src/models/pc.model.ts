import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PCOrder } from "./pcorder.model";

@Entity({ name: "pcs" })
export class PC {
  @PrimaryGeneratedColumn({ name: "pcid" })
  pcid: number;

  @Column({ name: "modelname", length: 50, nullable: false })
  modelname: string;

  @Column({ name: "cpu", length: 50, nullable: false })
  cpu: string;

  @Column({ name: "ramcapacity", length: 10, nullable: false })
  ramcapacity: string;

  @Column({ name: "microphone", default: true })
  microphone: boolean;

  @Column({ name: "webcam", default: true })
  webcam: boolean;

  @Column({ name: "price", type: "float", nullable: false })
  price: number;

  @Column({ name: "ssdcapacity", nullable: false })
  ssdcapacity: number;

  @OneToMany(() => PCOrder, (pcorder) => pcorder.pc)
  pcorders: PCOrder;
}
