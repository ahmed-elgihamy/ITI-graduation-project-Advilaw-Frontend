import { Injectable } from '@angular/core';
import { env } from '../env/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../types/ApiResponse';
import { JobFieldDTO } from '../../types/JobFields/JobFieldsDTO';

@Injectable({
  providedIn: 'root',
})
export class JobFieldsService {
  apiUrl = env.baseUrl;

  constructor(private http: HttpClient) {}

  GetJobFields(): Observable<ApiResponse<JobFieldDTO>> {
    return this.http.get<ApiResponse<JobFieldDTO>>(`${this.apiUrl}/jobfields`);
  }
}
