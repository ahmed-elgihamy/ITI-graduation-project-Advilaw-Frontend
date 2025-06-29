import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../types/ApiResponse';
import { env } from '../../env/env';
import { LawyerListDTO } from '../../../types/Lawyers/LawyerListDTO';

@Injectable({
  providedIn: 'root',
})
export class LawyersService {
  apiUrl = env.baseUrl;

  constructor(private http: HttpClient) {}

  GetLawyers(): Observable<ApiResponse<LawyerListDTO>> {
    return this.http.get<ApiResponse<LawyerListDTO>>(`${this.apiUrl}/lawyer`);
  }
}
