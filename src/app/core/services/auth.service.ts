import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { env } from '../env/env';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../types/decoded-token';
import { UserInfo } from '../../types/UserInfo';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _Router = inject(Router);

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedIn.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserInfo(): UserInfo | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const userInfo: UserInfo = {
        userId:
          decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
          ],
        name: decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ],
        role: decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ],
        foreignKey: +decoded.userId,
        email: decoded.email,
        expiresAt: decoded.exp,
      };

      return userInfo;
    } catch (err) {
      console.error('Invalid token:', err);
      return null;
    }
  }

  setRegisterForm(data: object): Observable<any> {
    return this.http.post(`${env.baseUrl}/Auth/register`, data);
  }

  setLoginForm(data: object): Observable<any> {
    return this.http.post(`${env.baseUrl}/Auth/login`, data);
  }
  logIn(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
  }

  logOut() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this._Router.navigate(['/login']);
  }

  setEmailVerify(data: object): Observable<any> {
    return this.http.post(`${env.baseUrl}/Auth/send-reset-code`, data);
  }

  setResetPassword(data: object): Observable<any> {
    return this.http.post(`${env.baseUrl}/Auth/reset-password`, data);
  }

  isAdmin(): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.role === 'Admin' || userInfo?.role === 'SuperAdmin';
  }
}
