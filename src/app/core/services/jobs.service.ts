import { Injectable, OnInit } from '@angular/core';
// import { AuthService } from './auth.service';
import { env } from '../env/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../../types/PagedResponse';
import { ApiResponse } from '../../types/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  // Role: string | null = null;
  apiUrl = env.baseUrl;

  constructor(private http: HttpClient) {
    // this.Role = authService.getUserInfo()?.role ?? null;
  }

  GetJob(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/Job/${id}`);
  }

  GetJobs(page: number): Observable<ApiResponse<PagedResponse<any>>> {
    return this.http.get<ApiResponse<PagedResponse<any>>>(
      `${this.apiUrl}/Job?pageNumber=${page}`
    );
  }

  CreateJob(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/job/create`, data);
  }

}
