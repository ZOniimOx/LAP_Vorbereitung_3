import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Reseller } from './reseller.model';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn({ name: 'userid' })
	userid: number;

	@Column({ name: ' username', length: 30 })
	username: string;

	@Column({ name: 'password' })
	password: string;

	@OneToOne(() => Reseller)
	@JoinColumn({ name: 'resellerid' })
	reseller: Reseller;
}
