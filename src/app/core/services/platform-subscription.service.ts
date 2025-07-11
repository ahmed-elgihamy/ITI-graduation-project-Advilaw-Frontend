import { CreatePlatformSubscriptionDTO } from './../../types/PlatformSubscription/CreatePlatformSubscriptionDTO';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../env/env';
import { PlatformSubscriptionDTO } from '../../types/PlatformSubscription/PlatformSubscriptionDTO';
import { ApiResponse } from '../../types/ApiResponse';

// New interfaces for checkout integration
export interface CreateLawyerSubscriptionRequest {
  lawyerId: string;
  subscriptions: SingleSubscriptionRequest[];
}

export interface SingleSubscriptionRequest {
  subscriptionTypeId: number;
  amount: number;
  subscriptionName: string;
}

export interface ConfirmSessionRequest {
  sessionId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlatformSubscriptionService {
  constructor(private http: HttpClient) {}

  GetPlatformSubscriptionPlans(): Observable<
    ApiResponse<PlatformSubscriptionDTO[]>
  > {
    return this.http.get<ApiResponse<PlatformSubscriptionDTO[]>>(
      `${env.baseUrl}/PlatformSubscription/plans`
    );
  }

  GetAllPlatformSubscription(): Observable<
    ApiResponse<PlatformSubscriptionDTO[]>
  > {
    return this.http.get<ApiResponse<PlatformSubscriptionDTO[]>>(
      `${env.baseUrl}/PlatformSubscription`
    );
  }

  ToggleActivation(
    id: number
  ): Observable<ApiResponse<PlatformSubscriptionDTO[]>> {
    return this.http.post<ApiResponse<PlatformSubscriptionDTO[]>>(
      `${env.baseUrl}/PlatformSubscription/${id}/change`,
      ''
    );
  }

  AddPlatformSubscription(
    data: CreatePlatformSubscriptionDTO
  ): Observable<ApiResponse<PlatformSubscriptionDTO>> {
    return this.http.post<ApiResponse<PlatformSubscriptionDTO>>(
      `${env.baseUrl}/PlatformSubscription`,
      data
    );
  }

  DeletePlatformSubscription(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${env.baseUrl}/PlatformSubscription/${id}`
    );
  }

  UpdatePlatformSubscription(
    id: number,
    data: CreatePlatformSubscriptionDTO
  ): Observable<ApiResponse<PlatformSubscriptionDTO>> {
    return this.http.put<ApiResponse<PlatformSubscriptionDTO>>(
      `${env.baseUrl}/PlatformSubscription/${id}`,
      data
    );
  }

  // Legacy method - keeping for backward compatibility
  buySubscription(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${env.baseUrl}/PlatformSubscription/${id}/buy`,
      {}
    );
  }

  // New methods for Stripe checkout integration
  createSubscriptionCheckoutSession(request: CreateLawyerSubscriptionRequest): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      `${env.baseUrl}/Checkout/create-lawyer-subscription-session`,
      request
    );
  }

  confirmSubscriptionSession(request: ConfirmSessionRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${env.baseUrl}/Checkout/confirm-session`,
      request
    );
  }
}
