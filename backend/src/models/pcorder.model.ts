import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	AfterLoad,
} from 'typeorm';
import { PC } from './pc.model';
import { Order } from './order.model';
import { AdditionalParts } from './additionalparts.model';

@Entity({ name: 'pcorders' })
export class PCOrder {
	@PrimaryGeneratedColumn({ name: 'pcorderid' })
	pcorderid: number;

	@Column({ name: 'quantity' })
	quantity: number;

	total: number;

	@JoinColumn({ name: 'pcid' })
	@ManyToOne(() => PC, (pc) => pc.pcorders)
	pc: PC;

	@JoinColumn({ name: 'orderid' })
	@ManyToOne(() => Order, (order) => order.pcorders, { onDelete: 'CASCADE' })
	order: Order;

	@ManyToMany(() => AdditionalParts)
	@JoinTable({
		name: 'pcorderadditionalparts',
		joinColumn: { name: 'pcorderid' },
		inverseJoinColumn: { name: 'partid' },
	})
	additionalparts: AdditionalParts[];

	@AfterLoad()
	calculateTotal() {
		let total = this.pc.price;

		if (this.additionalparts) {
			this.additionalparts.forEach((ap) => {
				total += ap.price;
			});
		}

		this.total = this.quantity * total;
	}
}
