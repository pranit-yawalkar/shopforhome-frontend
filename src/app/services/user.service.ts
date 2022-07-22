import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Signin } from '../models/user/signin';
import { Signup } from '../models/user/signup';
import { User } from '../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  doSignUp(signup: Signup): Observable<Object> {
    return this.http.post(`${this.BASE_URL}/user/signup`, signup);
  }

  doSignIn(signin: Signin): Observable<Object> {
    return this.http.post(`${this.BASE_URL}/user/signin`, signin);
  }

  getUserByToken(token: string): Observable<User> {
    return this.http.get<User> (`${this.BASE_URL}/user/getuser?token=${token}`);
  }
}
