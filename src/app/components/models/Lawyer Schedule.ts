export interface LawyerSchedule{
    day: string;                  
    timeRanges: {
    start: string;               
    end: string;                 
  }[];
}