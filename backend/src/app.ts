import express from "express";
import { router } from "./main.routers";
// import * as cors from "cors";
// var cors = require("cors");
import cors from "cors";
// import helmet from "helmet";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.baseconfig();
  }

  private baseconfig(): void {
    // this.app.use((req, res, next) => {
    //   // Website you wish to allow to connect
    //   res.setHeader("Access-Control-Allow-Origin", "*");

    //   // Request methods you wish to allow
    //   res.setHeader(
    //     "Access-Control-Allow-Methods",
    //     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    //   );

    //   // Request headers you wish to allow
    //   res.header(
    //     'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept'
    //   );

    //   // Try to prevent IE compat mode
    //   res.header("X-UA-Compatible", "IE=edge,chrome=1");

    //   // Pass to next layer of middleware
    //   next();
    // });
    // this.app.use(helmet());

    // Allow connection from local frontend

    this.app.use(cors({ origin: ["http://localhost:4200"] }));
    //Support application/json
    this.app.use(express.json());
    this.app.use("/api", router);
    // THIS:app.use
  }
}

export const app = new App().app;
