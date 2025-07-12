import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LawyerProfile } from '../../components/models/LawyerProfile';
import { Review } from '../../components/models/Review';
import { LawyerSchedule } from '../../components/models/Lawyer Schedule';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { env } from '../env/env';
import { LawyerDetails } from '../../types/Lawyers/LawyerDetails';

interface ApiResponse<T> {
  data: T;
}

export interface LawyerResponse {
  items: any[];
  totalPages: number;
  totalItemsCount: number;
  itemsFrom: number;
  itemsTo: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class LawyerService {
  constructor(private http: HttpClient) { }

  getProfile(id: string): Observable<LawyerProfile> {
    return this.http
      .get<ApiResponse<LawyerProfile>>(`${env.baseUrl}/lawyers/${id}/profile`)
      .pipe(
        map((res) => res.data),
        catchError(() => {
          throw new Error('Profile load failed');
        })
      );
  }

  GetLawyerDetails(): Observable<LawyerDetails> {
    return this.http
      .get<ApiResponse<LawyerDetails>>(`${env.baseUrl}/Lawyer/me`)
      .pipe(
        map((res) => res.data),
        catchError(() => {
          throw new Error('Profile load failed');
        })
      );
  }

  getReviews(id: string): Observable<Review[]> {
    return this.http
      .get<ApiResponse<Review[]>>(`${env.baseUrl}/lawyers/${id}/reviews`)
      .pipe(
        map((res) => res.data),
        catchError((err) => throwError(() => new Error('Reviews load failed')))
      );
  }

  getSchedule(id: string): Observable<LawyerSchedule[]> {
    return this.http
      .get<ApiResponse<LawyerSchedule[]>>(
        `${env.baseUrl}/lawyers/${id}/schedule`
      )
      .pipe(
        map((res) => res.data),
        catchError((err) => throwError(() => new Error('Schedule load failed')))
      );
  }

  getAllLawyers(page: number, size: number, searchPhrase: string = ''): Observable<LawyerResponse> {
    let params = new HttpParams()
      .set('PageNumber', page)
      .set('PageSize', size);

    if (searchPhrase) {
      params = params.set('SearchPhrase', searchPhrase);
    }

    return this.http.get<LawyerResponse>(`${env.baseUrl}/lawyer/all`, { params });
  }

  editLawyerProfile(data: LawyerDetails): Observable<any> {
    return this.http.put(`${env.baseUrl}/Lawyer/me/profile`, data);
  }

  getHourlyRate(lawyerId: string) {
    return this.http.get(`${env.baseUrl}/Lawyer/${lawyerId}/hourly-rate`);
  }
}
