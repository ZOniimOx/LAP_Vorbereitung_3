import { Request, Response } from 'express';
import { AdditionalParts, Order, PC, PCOrder, Reseller, User } from './models';
import logger from './logger.service';
import { appDbDataSource } from './database.connection';
import { log } from 'console';

export class MainController {
	//Get all orders
	public async getOrders() {
		return new Promise<Order[]>((resolve, reject) => {
			appDbDataSource
				.getRepository(Order)
				.find({
					relations: [
						'reseller',
						'pcorders',
						'pcorders.pc',
						'pcorders.additionalparts',
					],
				})
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	async getOrderById(orderid: number) {
		return new Promise<Order>((resolve, reject) => {
			appDbDataSource
				.getRepository(Order)
				.findOne({
					where: {
						orderid: orderid,
					},
					relations: [
						'reseller',
						'pcorders',
						'pcorders.pc',
						'pcorders.additionalparts',
					],
				})
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	async createOrder(order: Order) {
		return new Promise<unknown>((resolve, reject) => {
			appDbDataSource
				.getRepository(Order)
				.save(order)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	async createPcOrder(pcorder: PCOrder) {
		return new Promise<unknown>((resolve, reject) => {
			appDbDataSource
				.getRepository(PCOrder)
				.save(pcorder)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	//Delete order
	async deleteOrder(orderid) {
		return new Promise<unknown>((resolve, reject) => {
			appDbDataSource
				.getRepository(Order)
				.delete({ orderid: orderid })
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	//Delete pc order
	async deletePcOrder(pcorderid) {
		return new Promise<unknown>((resolve, reject) => {
			appDbDataSource
				.getRepository(PCOrder)
				.delete({ pcorderid: pcorderid })
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	// Get all pcs
	getPCs() {
		return new Promise<PC[]>((resolve, reject) => {
			const pcRepository = appDbDataSource.getRepository(PC);

			pcRepository
				.find()
				.then((result) => {
					resolve(result);
				})
				.catch((err: unknown) => {
					reject(err);
				});
		});
	}

	//Get all additional parts
	getAdditionalParts() {
		return new Promise<AdditionalParts[]>((resolve, reject) => {
			const apRepository = appDbDataSource.getRepository(AdditionalParts);
			apRepository
				.find()
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	getPcOrders() {
		return new Promise<PCOrder[]>((resolve, reject) => {
			const pcorderRepository = appDbDataSource.getRepository(PCOrder);
			pcorderRepository
				.find({
					relations: ['order', 'additionalparts', 'order.reseller', 'pc'],
				})
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	updatePcOrder(pcorderid: number, pcorder: PCOrder) {
		return new Promise<unknown>((resolve, reject) => {
			console.log(pcorder);

			if (isNaN(pcorderid)) {
				reject({ message: 'No pcorderid proviede' });
			}

			const pcorderRepository = appDbDataSource.getRepository(PCOrder);
			delete pcorder.pcorderid;
			pcorderRepository
				.update(pcorderid, pcorder)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	login(user: User) {
		return new Promise<Reseller>((resolve, reject) => {
			const userRepository = appDbDataSource.getRepository(User);
			userRepository
				.find({
					where: { username: user.username },
					relations: ['reseller'],
				})
				.then((result) => {
					let reseller: Reseller;
					console.log(result);
					if (result.length > 0) {
						result.forEach((e) => {
							if (e.password === user.password) {
								resolve(e.reseller);
							}
						});
						reject({
							type: 'passworderror',
							message: 'wrong username/passowrd',
						});
					} else {
						reject({
							type: 'passworderror',
							message: 'wrong username/passowrd',
						});
					}
				})
				.catch((err) => {
					logger.error(err);
					reject(err);
				});
		});
	}

	getOrdersByReseller(resellerid: number) {
		return new Promise<PCOrder[]>((resolve, reject) => {
			if (resellerid === undefined || isNaN(resellerid)) {
				reject({ message: 'no resellerid provided' });
			} else {
				const orderRepository = appDbDataSource.getRepository(PCOrder);
				orderRepository
					.find({
						relations: ['order', 'additionalparts', 'order.reseller', 'pc'],
						where: {
							order: {
								reseller: {
									reselerid: resellerid,
								},
							},
						},
					})
					.then((result) => {
						resolve(result);
					})
					.catch((err) => {
						logger.error(err);
						reject(err);
					});
			}
		});
	}

	//Get reseller by id
	getResellerById(reselerid: number) {
		return new Promise<Reseller>((resolve, reject) => {
			if (reselerid == undefined || isNaN(reselerid)) {
				reject({ message: 'No resellerid provided' });
			} else {
				const resellerRepository = appDbDataSource.getRepository(Reseller);

				resellerRepository
					.findOneBy({ reselerid: reselerid })
					.then((result) => {
						resolve(result);
					})
					.catch((err) => {
						logger.error(err);
						reject(err);
					});
			}
		});
	}
}

export const mainController = new MainController();
