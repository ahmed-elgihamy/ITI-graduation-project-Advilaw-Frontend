import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleEntry } from '../../types/ScheduleEntryDTO';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleService } from '../../core/services/schedule.service';
import { ActivatedRoute } from '@angular/router';

declare var bootstrap: any;
@Component({
  selector: 'app-weekly-schedule',
  templateUrl: './weekly-schedule.component.html',
  styleUrls: ['./weekly-schedule.component.css'],
  imports: [CommonModule, FormsModule],
})
export class WeeklyScheduleComponent implements OnInit {
  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute
  ) {}
  urlId = '';
  ngOnInit(): void {
    this.SCHEDULE = this.generateScheduleMap(this.scheduleListFromDB);
    this.urlId = this.route.snapshot.paramMap.get('id') || '';

    this.getSchedule();
  }
  selectedDate: Date | null = null;
  onlyValidDates = false;

  getSchedule() {
    this.scheduleService.getSchedule(this.urlId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.scheduleListFromDB = res.data;
        this.SCHEDULE = this.generateScheduleMap(this.scheduleListFromDB);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  toggleOnlyValidDates() {
    this.onlyValidDates = !this.onlyValidDates;
    console.log(this.onlyValidDates);
  }

  handleDateSelection(date: Date) {
    this.selectedDate = date;
  }
  days: string[] = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  HOURS = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];
  scheduleListFromDB: ScheduleEntry[] = [
    // { Day: 'Monday', StartTime: '09:00', EndTime: '12:00' },
    // { Day: 'Monday', StartTime: '14:00', EndTime: '17:00' },
    // { Day: 'Tuesday', StartTime: '08:00', EndTime: '10:00' },
    // { Day: 'Tuesday', StartTime: '13:00', EndTime: '18:00' },
  ];

  schedulesToAdd: ScheduleEntry[] = [];
  schedulesToRemove: number[] = [];

  openModal(): void {
    const modalElement = document.getElementById('scheduleModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

  closeModal(): void {
    const modalElement = document.getElementById('scheduleModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal?.hide();
  }

  SCHEDULE: { [key: string]: boolean[] } = {};

  selectedSlot: { day: string; hour: number } | null = null;
  newEntry: ScheduleEntry = { day: '', startTime: '', endTime: '' };

  addSchedule(): void {
    if (
      !this.newEntry.day ||
      this.newEntry.startTime >= this.newEntry.endTime
    ) {
      alert('Please enter valid schedule data.');
      return;
    }

    // this.scheduleListFromDB.push({ ...this.newEntry });
    this.schedulesToAdd.push({ ...this.newEntry });
    this.newEntry = { day: '', startTime: '', endTime: '' };

    console.log(this.schedulesToAdd);
    console.log(`to remove schedule: ${this.schedulesToRemove}`);
  }

  removeSchedule(index: number, id: number | undefined): void {
    this.scheduleListFromDB.splice(index, 1);
    this.schedulesToRemove.push(id!);
  }

  removeAddedSchedule(index: number): void {
    this.schedulesToAdd.splice(index, 1);
    this.newEntry = { day: '', startTime: '', endTime: '' };
  }

  saveSchedule() {
    console.log(`to remove schedule: ${this.schedulesToRemove}`);
    this.scheduleService
      .createSchedule(this.urlId, {
        SchedulesToBeAdded: this.schedulesToAdd,
        SchedulesToBeRemoved: this.schedulesToRemove,
        UserId: this.urlId,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.closeModal();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  generateScheduleMap(scheduleList: ScheduleEntry[]): {
    [key: string]: boolean[];
  } {
    const scheduleMap: { [key: string]: boolean[] } = {};

    this.days.forEach((day) => {
      scheduleMap[day] = new Array(24).fill(false);
    });

    for (const entry of scheduleList) {
      const day = entry.day;
      const startHour = parseInt(entry.startTime.split(':')[0], 10);
      const endHour = parseInt(entry.endTime.split(':')[0], 10);
      const start = Math.max(0, startHour);
      const end = Math.min(24, endHour);

      for (let hour = start; hour < end; hour++) {
        if (scheduleMap[day]) {
          scheduleMap[day][hour] = true;
        }
      }
    }

    console.log(scheduleMap);

    return scheduleMap;
  }

  onSlotSelected(slot: { day: string; hour: number }) {
    this.selectedSlot = slot;
  }
  formatHour(hour: number): string {
    if (hour === 12) return '12:00 PM';
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  }

  calculateFreeHours(day: string): number {
    return this.SCHEDULE[day]?.filter(Boolean).length || 0;
  }

  setSelectedSlot(day: string, hour: number) {
    this.selectedSlot = { day, hour };
  }

  get totalFreeHours(): number {
    return Object.values(this.SCHEDULE).flat().filter(Boolean).length;
  }
  isSelected(day: string, hour: number): boolean {
    return this.selectedSlot?.day === day && this.selectedSlot?.hour === hour;
  }
}
