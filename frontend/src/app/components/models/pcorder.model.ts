import { PC } from './pc.model';
import { Order } from './order.model';
import { AdditionalParts } from './additionalparts.model';

export interface PCOrder {
  pcorderid: number;
  quantity: number;
  pc: PC;
  order: Order;
  additionalparts: AdditionalParts[];
}
