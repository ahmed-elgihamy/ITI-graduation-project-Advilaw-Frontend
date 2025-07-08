import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { env } from '../env/env';
import { JobListDTO } from '../../types/Jobs/JobListDTO';
import { PagedResponse } from '../../types/PagedResponse';
import { ApiResponse, BackendResponse } from '../../types/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private readonly http = inject(HttpClient);

  // Get consultations for lawyer (LawyerProposal jobs)
  getConsultationsForLawyer(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResponse<JobListDTO>>> {
    const url = `${env.baseUrl}/Job/me/consultations?page=${page}&pageSize=${pageSize}`;
    return this.http.get<BackendResponse<PagedResponse<JobListDTO>>>(url)
      .pipe(
        map(backendResponse => ({
          data: backendResponse.data,
          succeeded: backendResponse.succeeded,
          message: backendResponse.message,
          statusCode: backendResponse.succeeded ? 200 : 400,
          errors: backendResponse.errors || [],
          meta: null
        }) as ApiResponse<PagedResponse<JobListDTO>>),
        catchError(this.handleError)
      );
  }

  // Accept consultation
  acceptConsultation(consultationId: number): Observable<ApiResponse<boolean>> {
    const url = `${env.baseUrl}/Job/consultation/${consultationId}/accept`;
    return this.http.post<BackendResponse<boolean>>(url, {})
      .pipe(
        map(backendResponse => ({
          data: backendResponse.data,
          succeeded: backendResponse.succeeded,
          message: backendResponse.message,
          statusCode: backendResponse.succeeded ? 200 : 400,
          errors: backendResponse.errors || [],
          meta: null
        }) as ApiResponse<boolean>),
        catchError(this.handleError)
      );
  }

  // Reject consultation
  rejectConsultation(consultationId: number, reason: string): Observable<ApiResponse<boolean>> {
    const url = `${env.baseUrl}/Job/consultation/${consultationId}/reject`;
    return this.http.post<BackendResponse<boolean>>(url, reason, {
      headers: { 'Content-Type': 'application/json' }
    })
      .pipe(
        map(backendResponse => ({
          data: backendResponse.data,
          succeeded: backendResponse.succeeded,
          message: backendResponse.message,
          statusCode: backendResponse.succeeded ? 200 : 400,
          errors: backendResponse.errors || [],
          meta: null
        }) as ApiResponse<boolean>),
        catchError(this.handleError)
      );
  }

  // Test method to verify API connectivity
  testApiConnection(): Observable<ApiResponse<PagedResponse<JobListDTO>>> {
    const url = `${env.baseUrl}/Job/me/consultations?PageNumber=1&PageSize=10`;
    console.log('Testing API connection to:', url);
    
    return this.http.get<BackendResponse<PagedResponse<JobListDTO>>>(url)
      .pipe(
        tap(response => console.log('API connection test successful:', response)),
        map(backendResponse => ({
          data: backendResponse.data,
          succeeded: backendResponse.succeeded,
          message: backendResponse.message,
          statusCode: backendResponse.succeeded ? 200 : 400,
          errors: backendResponse.errors || [],
          meta: null
        } as ApiResponse<PagedResponse<JobListDTO>>)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Consultation service error:', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error body:', error.error);
    
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
      if (error.error?.message) {
        errorMessage += ` - ${error.error.message}`;
      }
      
      // Handle specific error codes
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view consultations.';
      } else if (error.status === 400) {
        errorMessage = 'Bad request. Please check your authentication.';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 