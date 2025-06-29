import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../env/env';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../types/ApiResponse';
import { LawyerPaymentListDTO } from '../../types/Lawyers/LawyerPaymentListDTO';
import { PagedResponse } from '../../types/PagedResponse';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  Role: string | null = null;
  apiUrl = env.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.Role = authService.getUserInfo()?.role ?? null;
  }

  GetLawyerPayments(
    page: number
  ): Observable<ApiResponse<PagedResponse<LawyerPaymentListDTO>>> {
    return this.http.get<ApiResponse<PagedResponse<LawyerPaymentListDTO>>>(
      `${this.apiUrl}/lawyer/me/payments?pageNumber=${page}`
    );
  }
}
