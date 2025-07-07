import { Injectable, OnInit } from '@angular/core';
// import { AuthService } from './auth.service';
import { env } from '../env/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../../types/PagedResponse';
import { ApiResponse } from '../../types/ApiResponse';
import { CreateProposalDTO } from '../../types/Proposals/CreateProposalDTO';
import { CreateAppointmentDTO } from '../../types/Appointments/CreateAppointmentDTO';
import { AppointmentDetailsDTO } from '../../types/Appointments/AppointmentDetailsDTO';

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

  GetActiveJobs(page: number): Observable<ApiResponse<PagedResponse<any>>> {
    return this.http.get<ApiResponse<PagedResponse<any>>>(
      `${this.apiUrl}/Job/me/ActiveJobs?pageNumber=${page}`
    );
  }

  CreateJob(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Job/Create`, data);
  }

  ApplyToJob(data: CreateProposalDTO): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/proposals`, data);
  }

  MakeAppointment(
    jobId: number,
    data: CreateAppointmentDTO
  ): Observable<ApiResponse<AppointmentDetailsDTO>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/appointment/${jobId}/create`,
      data
    );
  }

  AcceptAppointment(id: number | undefined): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/appointment/${id}/accept`,
      null
    );
  }
}
