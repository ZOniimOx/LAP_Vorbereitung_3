import { Request, Response } from "express";
import { dsDatabase } from "./database.connection";
import { Order } from "./models";

export class MainController {
  public async getOrders(req: Request, res: Response) {
    (await dsDatabase)
      .getRepository(Order)
      .find()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  public async createOrder(req: Request, res: Response) {
    const data = req.body;
    console.log(data);

    (await dsDatabase)
      .getRepository(Order)
      .insert(data)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}

export const mainController = new MainController();
