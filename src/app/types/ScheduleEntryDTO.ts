export interface ScheduleEntry {
  UserId?: number;
  day: string; // e.g. "Monday"
  startTime: string; // 0–23
  endTime: string; // 0–23
}

export interface EditScheduleDTO {
  SchedulesToBeAdded: ScheduleEntry[];
  SchedulesToBeRemoved: number[];
  UserId: string;
}
