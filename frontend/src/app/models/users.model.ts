import { Reseller } from './reseller.model';

export interface User {
  userid: number;
  username: string;
  password: string;
  reseller: Reseller;
}
