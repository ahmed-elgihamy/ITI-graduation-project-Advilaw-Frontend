import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { env } from '../env/env';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _Router = inject(Router);

  // private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  // public isLoggedIn$ = this.loggedIn.asObservable();

  // private hasToken(): boolean {
  //   return !!localStorage.getItem('userToken');
  // }

  setRegisterForm(data: object): Observable<any> {
    return this.http.post(`${env.baseUrl}/api/Auth/register`, data);
  }

  setLoginForm(data: object): Observable<any> {
    return this.http.post(`${env.baseUrl}/api/Auth/login`, data);
  }
  logIn(token: string) {
    localStorage.setItem('userToken', token);
    // this.loggedIn.next(true);
  }


  logOut() {
    localStorage.removeItem('userToken');
    // this.loggedIn.next(false);
    this._Router.navigate(['/login']);
  }


  setEmailVerify(data: object): Observable<any> {
    return this.http.post(`${env.baseUrl}/api/Auth/send-reset-code`, data);
  }

  setResetPassword(data: object): Observable<any> {
    return this.http.post(`${env.baseUrl}/api/Auth/reset-password`, data);
  }
}
