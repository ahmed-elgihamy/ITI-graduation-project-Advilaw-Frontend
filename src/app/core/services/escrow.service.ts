import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

export interface ConfirmSessionPaymentResponse {
  message: string;
  sessionId: number;
}

export interface ReleaseSessionFundsRequest {
  sessionId: number;
}

@Injectable({
  providedIn: 'root',
})
export class EscrowService {
  private baseUrl = `${env.baseUrl}/escrow`;

  constructor(private http: HttpClient) {}

  createSessionPayment(
    request: CreateSessionPaymentRequest
  ): Observable<{ escrowId: number; checkoutUrl: string }> {
    return this.http.post<{ escrowId: number; checkoutUrl: string }>(
      `${this.baseUrl}/create-session`,
      request
    );
  }

  confirmSessionPayment(
    request: ConfirmSessionPaymentRequest
  ): Observable<ApiResponse<ConfirmSessionPaymentResponse>> {
    return this.http
      .post<ConfirmSessionPaymentResponse>(
        `${this.baseUrl}/confirm-session`,
        request
      )
      .pipe(
        map(
          (response) =>
            ({
              data: response,
              succeeded: true,
              message: response.message || 'Payment confirmed successfully',
              statusCode: 200,
              errors: [],
              meta: null,
            } as ApiResponse<ConfirmSessionPaymentResponse>)
        )
      );
  }

  releaseSessionFunds(
    request: ReleaseSessionFundsRequest
  ): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/release-session-funds`,
      request
    );
  }

  getClientEscrowPayments(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/my-escrow`);
  }
}
