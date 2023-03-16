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

  public async createOrder(req: Request, res: Response) {
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

    // {
    //     "orderdate": "2023-03-16",
    //     "quantity": 5,
    //     "reseller": {
    //         "resellerid": 2
    //     },
    //     "pc": {
    //         "pcid": 3
    //     },
    //     "additionalparts": [{
    //         "partid": 2
    //     }]
    // }
    // const data: CreateOrderRequest = req.body;

    // //Create order object
    // const order: Order = new Order();
    // order.orderdate = data.orderdate;
    // order.reseller = data.reseller;

    // console.log(order);

    // (await dsDatabase)
    //   .getRepository(Order)
    //   .save(order)
    //   .then(async (result) => {
    //     //Create pcorder object
    //     const pcorder: PCOrder = new PCOrder();
    //     pcorder.pc = data.pc;
    //     pcorder.quantity = data.quantity;
    //     pcorder.additionalparts = data.additionalparts;
    //     pcorder.order = result;

    //     (await dsDatabase)
    //       .getRepository(PCOrder)
    //       .save(pcorder)
    //       .then((result) => {
    //         res.status(200).send(result);
    //       })
    //       .catch((err) => {
    //         res.status(500).send(err);
    //       });
    //   })
    //   .catch((err) => {
    //     res.status(500).send(err);
    //   });

    // (await dsDatabase)
    //   .getRepository(Order)
    //   .save(data)
    //   .then((result) => {
    //     res.status(200).send(result);
    //   })
    //   .catch((err) => {
    //     res.status(500).send(err);
    //   });

    // res.status(200).send(data);
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
}

export const mainController = new MainController();
