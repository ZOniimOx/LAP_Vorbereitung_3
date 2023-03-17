import { Request, Response } from "express";
import { dsDatabase } from "./database.connection";
import { Order, PCOrder } from "./models";
import { CreateOrderRequest } from "./models/createorder.model";

export class MainController {
  public async getOrders(req: Request, res: Response) {
    (await dsDatabase)
      .getRepository(Order)
      .find({
        relations: [
          "reseller",
          "pcorders",
          "pcorders.pc",
          "pcorders.additionalparts",
        ],
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  async getOrderById(req: Request, res: Response) {
    const orderid: number = Number(req.params.id);

    if(orderid === undefined || isNaN(orderid)) {
      res.status(400).send('No orderid provieded')
    }

    (await dsDatabase)
      .getRepository(Order)
      .find({
        where: {
          orderid: orderid,
        },
        relations: [
          "reseller",
          "pcorders",
          "pcorders.pc",
          "pcorders.additionalparts",
        ],
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  async createOrder(req: Request, res: Response) {
    const data = req.body;

    (await dsDatabase)
      .getRepository(Order)
      .save(data)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  async createPcOrder(req: Request, res: Response) {
    const data = req.body;
    (await dsDatabase)

      .getRepository(PCOrder)
      .save(data)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  async deleteOrder(req: Request, res: Response) {
    const orderid: number = Number(req.params.id);
    if (orderid === undefined || isNaN(orderid)) {
      res.status(404).send("No orderid provied");
    }
    (await dsDatabase)
      .getRepository(Order)
      .delete({ orderid: orderid })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  async deletePcOrder(req: Request, res: Response) {
    const pcorderid: number = Number(req.params.id);
    if (pcorderid === undefined || isNaN(pcorderid)) {
      res.status(404).send("No orderid provied");
    }

    (await dsDatabase)
      .getRepository(PCOrder)
      .delete({ pcorderid: pcorderid })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}

export const mainController = new MainController();
