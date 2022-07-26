import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddToCart } from '../models/cart/add-to-cart';
import { Product } from '../models/product/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private BASE_URL = environment.BASE_URL;
  response!: any;

  constructor(private http: HttpClient) { }

  getAllProducts(token: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.BASE_URL}/cart/getAll/${token}`);
  }

  removeProduct(token: string, id: number): Observable<Object> {
    return this.http.delete(`${this.BASE_URL}/cart/delete/${id}?token=${token}`);
  }

  addProduct(token: string, addToCart: AddToCart): Observable<Object> {
    return this.http.post(`${this.BASE_URL}/cart/add?token=${token}`, addToCart);
  }

  updateCart(token: string, cartItemId: number, addToCart: AddToCart): Observable<Object> {
    return this.http.put(`${this.BASE_URL}/cart/edit/${cartItemId}?token=${token}`, addToCart);
  }

  removeAll(token: string): Observable<Object> {
    return this.http.delete(`${this.BASE_URL}/cart/deleteAll?token=${token}`);
  }

}
