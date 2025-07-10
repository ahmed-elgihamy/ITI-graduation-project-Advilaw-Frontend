import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../env/env';
import { ApiResponse } from '../../types/ApiResponse';
import { PagedResponse } from '../../types/PagedResponse';
import { ChatDTO } from '../../types/Chat/ChatDTO';
import { ClientPaymentDTO, ClientPaymentStatistics, ClientBalance, WithdrawalRequest } from '../../types/Clients/ClientPaymentDTO';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  apiUrl = env.baseUrl;

  constructor(private http: HttpClient) {}



  // Get client jobs 
  getClientJobs(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/job`);
  }

  // Get client chats
  getClientChats(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResponse<ChatDTO>>> {
    return this.http.get<ApiResponse<PagedResponse<ChatDTO>>>(`${this.apiUrl}/client/me/chats?page=${page}&pageSize=${pageSize}`);
  }

  // Get chat by ID
  getChatById(chatId: number): Observable<ApiResponse<ChatDTO>> {
    return this.http.get<ApiResponse<ChatDTO>>(`${this.apiUrl}/client/me/chats/${chatId}`);
  }

  // Get client payments
  getClientPayments(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResponse<ClientPaymentDTO>>> {
    return this.http.get<ApiResponse<PagedResponse<ClientPaymentDTO>>>(`${this.apiUrl}/client/me/payments?page=${page}&pageSize=${pageSize}`);
  }

  // Get client escrow payments
  getClientEscrowPayments(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResponse<ClientPaymentDTO>>> {
    return this.http.get<ApiResponse<PagedResponse<ClientPaymentDTO>>>(`${this.apiUrl}/client/me/escrow-payments?page=${page}&pageSize=${pageSize}`);
  }

  // Get client payment by ID
  getClientPaymentById(paymentId: number): Observable<ApiResponse<ClientPaymentDTO>> {
    return this.http.get<ApiResponse<ClientPaymentDTO>>(`${this.apiUrl}/dummy/${paymentId}`);
  }

 

  // Get client balance
  getClientBalance(): Observable<ApiResponse<ClientBalance>> {
    return this.http.get<ApiResponse<ClientBalance>>(`${this.apiUrl}/client/dummy`);
  }

  // Get client withdrawals
  getClientWithdrawals(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResponse<WithdrawalRequest>>> {
    return this.http.get<ApiResponse<PagedResponse<WithdrawalRequest>>>(`${this.apiUrl}/client/me/withdrawals?page=${page}&pageSize=${pageSize}`);
  }

  // Request withdrawal
  requestWithdrawal(amount: number, paymentMethod: string, bankAccount?: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/client/me/withdrawals`, {
      amount,
      paymentMethod,
      bankAccount
    });
  }

  // Get client profile
  getClientProfile(): Observable<ApiResponse<any>> {

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/Client/me/profile`);
  }

  // Update client profile
  updateClientProfile(profileData: any): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/Client/me/profile`, profileData);
  }

  // Upload client profile image
  uploadProfileImage(imageFile: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Client/me/profile/image`, formData);
  }
} 