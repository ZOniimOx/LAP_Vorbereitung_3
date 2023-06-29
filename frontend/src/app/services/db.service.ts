import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Order } from '../models/order.model';
import { PCOrder } from '../models/pcorder.model';
import { PC } from '../models/pc.model';
import { AdditionalParts } from '../models/additionalparts.model';
import { Injectable } from '@angular/core';
import { User } from '../models/users.model';
import { Reseller } from '../models/reseller.model';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getOrders() {
    return firstValueFrom(this.http.get<Order[]>(this.apiUrl + '/orders'));
  }

  getPcOrders() {
    return firstValueFrom(this.http.get<PCOrder[]>(`${this.apiUrl}/pcorder`));
  }

  createOrder(order: Order) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/orders`, order));
  }

  createPcOrder(pcorder: PCOrder) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/pcorder`, pcorder));
  }

  updatePcOrder(pcorder: any) {
    return firstValueFrom(
      this.http.put(`${this.apiUrl}/pcorder/${pcorder.pcorderid}`, pcorder)
    );
  }

  deletOrder(orderid: number) {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/orders/${orderid}`));
  }

  deletePcOrder(pcorderid: number) {
    return firstValueFrom(
      this.http.delete(`${this.apiUrl}/pcorder/${pcorderid}`)
    );
  }

  getPcs() {
    return firstValueFrom(this.http.get<PC[]>(`${this.apiUrl}/pc`));
  }

  getAdditionalParts() {
    return firstValueFrom(
      this.http.get<AdditionalParts[]>(`${this.apiUrl}/pc/additionalparts`)
    );
  }

  login(user: User) {
    return firstValueFrom(
      this.http.post<Reseller>(`${this.apiUrl}/login`, user)
    );
  }

  getPcOrdersByReseller(resellerid: number) {
    return firstValueFrom(
      this.http.get<PCOrder[]>(`${this.apiUrl}/orders/reseller/${resellerid}`)
    );
  }

  getResellerById(resellerid: number) {
    return firstValueFrom(
      this.http.get<Reseller>(`${this.apiUrl}/reseller/${resellerid}`)
    );
  }
}
