import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart } from '../models/cart/cart';
import { Coupon } from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private BASE_URL = environment.BASE_URL;
  
  constructor(private http: HttpClient) { }

  getAllCoupons(role: string): Observable<Coupon[]> {
    return this.http.get<Coupon[]> (`${this.BASE_URL}/coupon/getAll?role=${role}`);
  }

  getCouponById(id: number, role: string): Observable<Coupon> {
    return this.http.get<Coupon> (`${this.BASE_URL}/coupon/get/${id}?role=${role}`);
  }

  updateCoupon(id: number, role: string, coupon: Coupon): Observable<Object> {
    return this.http.put(`${this.BASE_URL}/coupon/update/${id}?role=${role}`, coupon);
  }

  deleteCoupon(id: number, role: string): Observable<Object> {
    return this.http.delete(`${this.BASE_URL}/coupon/delete/${id}?role=${role}`);
  }

  addCoupon(role: string, coupon: Coupon): Observable<Object> {
    return this.http.post(`${this.BASE_URL}/coupon/create?role=${role}`, coupon);
  }

  applyCoupon(token: string, coupon: Coupon): Observable<Cart> {
    return this.http.post<Cart>(`${this.BASE_URL}/cart/applyCoupon?token=${token}`, coupon);
  }

  getCouponByCode(code: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.BASE_URL}/coupon/getCoupon/${code}`);
  }

}
