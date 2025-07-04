import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


import { LawyerProfile } from '../components/models/LawyerProfile';
import { Review } from '../components/models/Review';
import { LawyerSchedule } from '../components/models/Lawyer Schedule'; 


interface ApiResponse<T> {
  data: T;
  message?: string;
  succeeded?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LawyerService {
  private baseUrl = 'https://localhost:44302/api/lawyers';

  constructor(private http: HttpClient) {}


  getProfile(id: string): Observable<LawyerProfile> {
    return this.http
      .get<ApiResponse<LawyerProfile>>(`${this.baseUrl}/${id}/profile`)
      .pipe(
        map((res) => res.data),
        catchError((err) =>
          throwError(() => new Error('Failed to load lawyer profile'))
        )
      );
  }

  
  getReviews(id: string): Observable<Review[]> {
    return this.http
      .get<ApiResponse<Review[]>>(`${this.baseUrl}/${id}/reviews`)
      .pipe(
        map((res) => res.data),
        catchError((err) =>
          throwError(() => new Error('Failed to load reviews'))
        )
      );
  }


  getSchedule(id: string): Observable<LawyerSchedule[]> {
    return this.http
      .get<ApiResponse<LawyerSchedule[]>>(`${this.baseUrl}/${id}/schedule`)
      .pipe(
        map((res) => res.data),
        catchError((err) =>
          throwError(() => new Error('Failed to load schedule'))
        )
      );
  }
}

