import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../env/env';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../types/ApiResponse';
import { ProposalDetailsDTO } from '../../types/Proposals/ProposalDetailsDTO';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  Role: string | null = null;
  apiUrl = env.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.Role = authService.getUserInfo()?.role ?? null;
  }
  GetProposal(proposalId: number): Observable<ApiResponse<ProposalDetailsDTO>> {
    return this.http.get<ApiResponse<ProposalDetailsDTO>>(
      `${this.apiUrl}/proposals/${proposalId}`
    );
  }

  AcceptProposal(proposalId: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/proposals/${proposalId}/accept`,
      null
    );
  }

  RejectProposal(proposalId: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/proposals/${proposalId}/reject`,
      null
    );
  }
}
