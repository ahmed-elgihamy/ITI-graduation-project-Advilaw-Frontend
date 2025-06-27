import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:5214/api/Admin';

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
approveLawyer(lawyerId: number): Observable<string> {
  return this.http.post(`${this.apiUrl}/lawyers/${lawyerId}/approve`, {}, { responseType: 'text' });
}


  // Edit admin profile
  editAdminProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profileData);
  }

  // Get all admins
  getAllAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admins`);
  }

  // Assign role to another admin
  assignRoleToAdmin(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admins/${userId}/role`, { role });
  }
} 