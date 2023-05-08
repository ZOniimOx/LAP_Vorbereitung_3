import { PCOrder } from './pcorder.model';

export interface PC {
  pcid: number;
  modelname: string;
  cpu: string;
  ramcapacity: string;
  microphone: boolean;
  webcam: boolean;
  price: number;
  ssdcapacity: string;
  pcorders: PCOrder[];
}
