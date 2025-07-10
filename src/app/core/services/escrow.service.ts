import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../env/env';
import { ApiResponse } from '../../types/ApiResponse';

export interface CreateSessionPaymentRequest {
  jobId: number;
  clientId: string;
}

export interface CreateSessionPaymentResponse {
  escrowId: number;
  checkoutUrl: string;
}

export interface ConfirmSessionPaymentRequest {
  stripeSessionId: string;
}

export interface ReleaseSessionFundsRequest {
  sessionId: number;
}

@Injectable({
  providedIn: 'root'
})
export class EscrowService {
  private baseUrl = `${env.baseUrl}/escrow`;

  constructor(private http: HttpClient) {}

  createSessionPayment(request: CreateSessionPaymentRequest): Observable<{ escrowId: number, checkoutUrl: string }> {
    return this.http.post<{ escrowId: number, checkoutUrl: string }>(
      `${this.baseUrl}/create-session`,
      request
    );
  }


  confirmSessionPayment(request: ConfirmSessionPaymentRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/confirm-session`,
      request
    );
  }

 
  releaseSessionFunds(request: ReleaseSessionFundsRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/release-session-funds`,
      request
    );
  }

 
  getClientEscrowPayments(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/my-escrow`);
  }
} 