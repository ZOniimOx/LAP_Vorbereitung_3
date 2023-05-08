import { Reseller } from './reseller.model';
import { PCOrder } from './pcorder.model';

export interface Order {
  orderid: number;
  orderdate: Date;
  reseller: Reseller;
  pcorders: PCOrder[];
}
