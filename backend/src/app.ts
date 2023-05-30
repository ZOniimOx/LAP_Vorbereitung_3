import express from 'express';
import { router } from './main.routers';
import cors from 'cors';
import helmet from 'helmet';

class App {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.baseconfig();
	}

	private baseconfig(): void {
		// Automatically set various security headers
		this.app.use(helmet());
		this.app.use((req, res, next) => {
			// Website you wish to allow to connect
			res.setHeader('Access-Control-Allow-Origin', '*');

			// Request methods you wish to allow
			res.setHeader(
				'Access-Control-Allow-Methods',
				'GET, POST, OPTIONS, PUT, PATCH, DELETE'
			);

			// Request headers you wish to allow
			res.header(
				'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept'
			);

			// Try to prevent IE compat mode
			res.header('X-UA-Compatible', 'IE=edge,chrome=1');

			// Pass to next layer of middleware
			next();
		});

		// Allow connection from local frontend
		this.app.use(cors());

		//Support application/json
		this.app.use(express.json());

		// serve router endpoints
		this.app.use('/api', router);
	}
}

export const app = new App().app;
