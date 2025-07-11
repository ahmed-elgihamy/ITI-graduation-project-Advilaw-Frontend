import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { env } from '../../env/env';
import { ApiResponse } from '../../../types/ApiResponse';

export interface SessionData {
  id: number;
  sessionId: number;
  jobTitle: string;
  lawyerName: string;
  clientName: string;
  amount: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminFundReleasesService {
  private baseUrl = `${env.baseUrl}/escrow`;

  constructor(private http: HttpClient) {}

  getCompletedSessions(): Observable<ApiResponse<SessionData[]>> {
    return this.http.get<SessionData[]>(`${this.baseUrl}/admin/completed-sessions`).pipe(
      map(response => ({
        data: response,
        succeeded: true,
        message: 'Sessions loaded successfully',
        statusCode: 200,
        errors: [],
        meta: null
      } as ApiResponse<SessionData[]>))
    );
  }

  releaseSessionFunds(sessionId: number): Observable<ApiResponse<any>> {
    return this.http.post<any>(`${this.baseUrl}/release-session-funds`, { sessionId }).pipe(
      map(response => ({
        data: response,
        succeeded: true,
        message: 'Funds released successfully',
        statusCode: 200,
        errors: [],
        meta: null
      } as ApiResponse<any>))
    );
  }
} 