import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private BASE_URL = environment.BASE_URL;
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]> (`${this.BASE_URL}/product/getAll`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product> (`${this.BASE_URL}/product/get/${id}`);
  }

  getProductByCategoryName(categoryName: string): Observable<Product[]> {
    return this.http.get<Product[]> (`${this.BASE_URL}/product/get/category/${categoryName}`);
  }

  getProductByCategoryId(id: number): Observable<Product[]> {
    return this.http.get<Product[]> (`${this.BASE_URL}/product/get/categoryid/${id}`);
  }
}
