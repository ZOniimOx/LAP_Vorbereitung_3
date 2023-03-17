import { Router, Request, Response, response } from "express";
import { mainController } from "./main.controller";

class MainRoutes {
  public router: Router = Router();

  constructor() {
    this.baseconfig();
  }

  private baseconfig(): void {
    this.router.get("/orders/:id", (req: Request, res: Response) => {
      mainController.getOrderById(req, res);
    });

    this.router.get("/orders", (req: Request, res: Response) => {
      mainController.getOrders(req, res);
    });

    this.router.post("/orders", (req: Request, res: Response) => {
      mainController.createOrder(req, res);
    });

    this.router.delete("/orders/:id", (req: Request, res: Response) => {
      mainController.deleteOrder(req, res);
    });

    // Pc order routes
    this.router.post("/pcorder", (req: Request, res: Response) => {
      mainController.createPcOrder(req, res);
    });

    this.router.delete("/pcorder/:id", (req: Request, res: Response) => {
      mainController.deletePcOrder(req, res);
    });
  }
}

export const router = new MainRoutes().router;
