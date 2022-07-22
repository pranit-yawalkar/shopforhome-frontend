import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private BASE_URL = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]> (`${this.BASE_URL}/category/getAll`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category> (`${this.BASE_URL}/category/get/${id}`);
  }
}
