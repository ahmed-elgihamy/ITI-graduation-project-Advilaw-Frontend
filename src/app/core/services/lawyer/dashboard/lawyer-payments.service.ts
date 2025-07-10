import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LawyerPaymentsService {
  private apiUrl = 'https://localhost:44302/api/LawyerPayments';

  constructor(private http: HttpClient) {}

  createStripeAccount(): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-stripe-account`, {});
  }

  getStripeOnboardingLink(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stripe-onboarding-link`);
  }

  getStripeAccountStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stripe-account-status`);
  }

  getStripeDashboardLink(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stripe-dashboard-link`);
  }


}
