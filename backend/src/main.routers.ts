import { Router, Request, Response, response } from 'express';
import { mainController } from './main.controller';
import logger from './logger.service';
import { Order, PCOrder, User } from './models';
class MainRoutes {
	public router: Router = Router();

	constructor() {
		this.baseconfig();
	}

	private baseconfig(): void {
		//Get orders by reseller
		this.router.get('/orders/reseller/:id', (req: Request, res: Response) => {
			const resellerid: number = Number(req.params.id);
			mainController
				.getOrdersByReseller(resellerid)
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					console.log(err);
					res.status(500).send(err);
				});
		});

		// Get order by id
		this.router.get('/orders/:id', (req: Request, res: Response) => {
			const orderid: number = Number(req.params.id);

			if (orderid === undefined || isNaN(orderid)) {
				res.status(400).send('No orderid provieded');
			} else {
				mainController
					.getOrderById(orderid)
					.then((result) => {
						res.status(200).send(result);
					})
					.catch((err) => {
						res.status(500).send(err);
					});
			}
		});

		//Get all orders
		this.router.get('/orders', (req: Request, res: Response) => {
			mainController
				.getOrders()
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		});

		//Create order
		this.router.post('/orders', (req: Request, res: Response) => {
			const order = req.body as Order;
			mainController
				.createOrder(order)
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		});

		// delete orders
		this.router.delete('/orders/:id', (req: Request, res: Response) => {
			const orderid: number = Number(req.params.id);
			if (orderid === undefined || isNaN(orderid)) {
				res.status(404).send('No orderid provied');
			}

			mainController
				.deleteOrder(orderid)
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		});

		// Create pcorder
		this.router.post('/pcorder', (req: Request, res: Response) => {
			const pcorder = req.body as PCOrder;
			mainController
				.createPcOrder(pcorder)
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		});

		this.router.put('/pcorder/:id', (req: Request, res: Response) => {
			const pcorderid = Number(req.params.id);
			const pcorder = req.body as PCOrder;
			mainController
				.updatePcOrder(pcorderid, pcorder)
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		});

		this.router.get('/pcorder', (req: Request, res: Response) => {
			mainController
				.getPcOrders()
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		});

		this.router.delete('/pcorder/:id', (req: Request, res: Response) => {
			const pcorderid: number = Number(req.params.id);
			if (pcorderid === undefined || isNaN(pcorderid)) {
				res.status(404).send('No orderid provied');
			}

			mainController
				.deletePcOrder(pcorderid)
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		});

		//PC routes
		this.router.get('/pc', (req: Request, res: Response) => {
			mainController
				.getPCs()
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					logger.error(err);
					res.status(500).send(err);
				});
		});

		//Get all additional parts
		this.router.get('/pc/additionalparts', (req: Request, res: Response) => {
			mainController
				.getAdditionalParts()
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					logger.error(err);
					res.status(500).send(err);
				});
		});

		this.router.post('/login', (req: Request, res: Response) => {
			const user: User = req.body as User;
			console.log(user);

			mainController
				.login(user)
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					if (err.type === 'passworderror') {
						res.status(404).send(err);
					} else {
						res.status(500).send(err);
					}
				});
		});

		// Get reseller by id
		this.router.get('/reseller/:id', (req: Request, res: Response) => {
			const resellerid: number = Number(req.params.id);

			mainController
				.getResellerById(resellerid)
				.then((result) => {
					res.status(200).send(result);
				})
				.catch((err) => {
					res.status(500).send(err);
				});
		});
	}
}

export const router = new MainRoutes().router;
