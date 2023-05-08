import { PCOrder } from './pcorder.model';

export interface AdditionalParts {
  partid: number;
  partname: string;
  price: number;
  pcorders: PCOrder[];
}
