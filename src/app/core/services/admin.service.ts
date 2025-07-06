import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../env/env';
import { Lawyer } from '../models/lawyer.model';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${env.baseUrl}/Admin`;

  constructor(private http: HttpClient) {}

  // Get all pending lawyers
  getPendingLawyers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lawyers/pending`);
  }

  // Get all pending clients
  getPendingClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients/pending`);
  }

// Approve a client by ID
approveClient(clientId: number): Observable<string> {
  return this.http.post(`${this.apiUrl}/clients/${clientId}/approve`, {}, { responseType: 'text' });
}

// Approve a lawyer by ID
approveLawyer(lawyerId: string): Observable<string> {
  return this.http.post(`${this.apiUrl}/lawyers/${lawyerId}/approve`, {}, { responseType: 'text' });
}

getLawyerById(id: string): Observable<Lawyer> {
  return this.http.get<Lawyer>(`${this.apiUrl}/lawyers/${id}`);
}
getClientById(id: string): Observable<Client> {
  return this.http.get<Client>(`${this.apiUrl}/clients/${id}`);
}

//get admin profile
getAdminProfile(): Observable<any> {
  return this.http.get(`${this.apiUrl}/profile`);
}

  // Edit admin profile
  editAdminProfile(profileData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile`, profileData);
  }

  // Get all admins
  getAllAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admins`);
  }

  // Assign role to another admin
  assignRoleToAdmin(userId: string, role: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/admins/${userId}/role`,
      { role },
      { responseType: 'text' }
    );
  }

} 