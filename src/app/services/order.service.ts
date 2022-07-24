import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart } from '../models/cart/cart';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private BASE_URL = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  placeOrder(token: string, cart: Cart): Observable<Object> {
    return this.http.post(`${this.BASE_URL}/order/place-order?token=${token}`, cart);
  }

  getAllOrders(token: string): Observable<Object> {
    return this.http.get<Object> (`${this.BASE_URL}/order/getAll?token=${token}`);
  }

  getAllSortedOrders(role: string): Observable<Object> {
    return this.http.get<Object> (`${this.BASE_URL}/order/getAllSorted?role=${role}`);
  }

  getAllSortedOrdersAsc(role: string): Observable<Object> {
    return this.http.get<Object> (`${this.BASE_URL}/order/getAllSortedAsc?role=${role}`);
  }

  deleteOrder(orderId: number, role: string): Observable<Object> {
    return this.http.delete(`${this.BASE_URL}/order/delete/${orderId}?role=${role}`);
  }
}
