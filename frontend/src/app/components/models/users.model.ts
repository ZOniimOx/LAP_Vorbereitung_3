import { Reseller } from './reseller.model';

export interface User {
  userid: number;
  username: string;
  passwort: string;
  reseller: Reseller;
}
