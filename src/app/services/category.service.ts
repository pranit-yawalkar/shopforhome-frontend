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

  getCategoryByName(categoryName: string): Observable<Category> {
    return this.http.get<Category> (`${this.BASE_URL}/category/get/category/${categoryName}`);
  }

  addCategory(category: Category): Observable<Object> {
    return this.http.post(`${this.BASE_URL}/category/create`, category);
  }

  updateCategory(category: Category, id: number): Observable<Object> {
    return this.http.put(`${this.BASE_URL}/category/update/${id}`, category);
  }

  deleteCategory(id: number): Observable<Object> {
    console.log(id);
    return this.http.delete(`${this.BASE_URL}/category/delete/${id}`);
  }

}
