import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LawyerProfile } from '../components/models/LawyerProfile';
import { Review } from '../components/models/Review';
import { LawyerSchedule } from '../components/models/Lawyer Schedule';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface ApiResponse<T> {
  data: T;
 
}

@Injectable({ providedIn: 'root' })
export class LawyerService {
  private baseUrl = 'https://localhost:44302/api/lawyers';

  constructor(private http: HttpClient) {}

  getProfile(id: number): Observable<LawyerProfile> {
    return this.http
      .get<ApiResponse<LawyerProfile>>(`${this.baseUrl}/${id}/profile`)
      .pipe(
        map(res => res.data),
        catchError(err => throwError(() => new Error('Profile load failed')))
      );
  }

  getReviews(id: number): Observable<Review[]> {
    return this.http
      .get<ApiResponse<Review[]>>(`${this.baseUrl}/${id}/reviews`)
      .pipe(
        map(res => res.data),
        catchError(err => throwError(() => new Error('Reviews load failed')))
      );
  }

  getSchedule(id: number): Observable<LawyerSchedule[]> {
    return this.http
      .get<ApiResponse<LawyerSchedule[]>>(`${this.baseUrl}/${id}/schedule`)
      .pipe(
        map(res => res.data),
        catchError(err => throwError(() => new Error('Schedule load failed')))
      );
  }
}
