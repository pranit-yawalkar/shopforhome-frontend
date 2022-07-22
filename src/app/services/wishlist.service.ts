import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Addtowishlist } from '../models/wishlist/addtowishlist';
import { Product } from '../models/product';
import { WishlistItem } from '../models/wishlist/wishlist-item';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private BASE_URL = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  getAllProducts(token: string): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]> (`${this.BASE_URL}/wishlist/getAll/${token}`);
  }

  removeProduct(token: string, id: number): Observable<Object> {
    return this.http.delete(`${this.BASE_URL}/wishlist/delete/${id}?token=${token}`);
  }

  addProduct(token: string, addToWishlist: Addtowishlist): Observable<Object> {
    return this.http.post(`${this.BASE_URL}/wishlist/add?token=${token}`, addToWishlist);
  }
}
