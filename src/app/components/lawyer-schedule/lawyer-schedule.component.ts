import { Component } from '@angular/core';
import { WeeklyScheduleComponent } from '../weekly-schedule/weekly-schedule.component';

@Component({
  selector: 'app-lawyer-schedule',
  templateUrl: './lawyer-schedule.component.html',
  styleUrl: './lawyer-schedule.component.css',
  imports: [WeeklyScheduleComponent],
})
export class LawyerScheduleComponent {}
