import { User } from './users.model';

export interface Reseller {
  reselerid: number;
  name: string;
  user?: User;
}
