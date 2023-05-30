import { Reseller } from './reseller.model';
import { PCOrder } from './pcorder.model';

export interface Order {
  orderid: number;
  orderdate: Date;
  ordernumber: string;
  reseller: Reseller;
  pcorders: PCOrder[];
}
