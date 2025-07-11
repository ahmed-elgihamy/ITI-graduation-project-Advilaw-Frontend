import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { env } from '../../env/env';
import { ApiResponse } from '../../../types/ApiResponse';

export interface SessionHistoryData {
  id: number;
  sessionId: number;
  jobTitle: string;
  lawyerName: string;
  clientName: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentId: number;
  paymentCreatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminSessionHistoryService {
  private baseUrl = `${env.baseUrl}/escrow`;

  constructor(private http: HttpClient) {}

  getSessionHistory(): Observable<ApiResponse<SessionHistoryData[]>> {
    return this.http.get<SessionHistoryData[]>(`${this.baseUrl}/admin/session-history`).pipe(
      map(response => ({
        data: response,
        succeeded: true,
        message: 'Session history loaded successfully',
        statusCode: 200,
        errors: [],
        meta: null
      } as ApiResponse<SessionHistoryData[]>))
    );
  }
} 