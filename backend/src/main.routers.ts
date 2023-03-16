import { Router, Request, Response, response } from "express";
import { mainController } from "./main.controller";

class MainRoutes {
  public router: Router = Router();

  constructor() {
    this.baseconfig();
  }

  private baseconfig(): void {
    this.router.get("/orders", (req: Request, res: Response) => {
      mainController.getOrders(req, res);
    });

    this.router.post("/orders", (req: Request, res: Response) => {
      mainController.createOrder(req, res);
    });
  }
}

export const router = new MainRoutes().router;
