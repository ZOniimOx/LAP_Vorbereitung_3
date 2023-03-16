import express from "express";
import { router } from "./main.routers";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.baseconfig();
  }

  private baseconfig(): void {
    //Support application/json
    this.app.use(express.json());
    this.app.use("/api", router);
  }
}

export const app = new App().app;
