import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EditScheduleDTO } from '../../types/ScheduleEntryDTO';
import { env } from '../env/env';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  getSchedule(id: string) {
    return this.http.get(`${env.baseUrl}/lawyers/${id}/schedule/normal`);
  }

  createSchedule(id: string, data: EditScheduleDTO) {
    console.log(data);
    return this.http.post(`${env.baseUrl}/lawyers/${id}/schedule`, data);
  }
}
