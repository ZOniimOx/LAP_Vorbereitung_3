import { Request, Response } from 'express';
import { AdditionalParts, Order, PC, PCOrder } from './models';
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
}

export const mainController = new MainController();
