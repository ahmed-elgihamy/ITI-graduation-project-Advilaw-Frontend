import { Component } from '@angular/core';
import { JobsService } from '../../../core/services/jobs.service';
import { ApiResponse } from '../../../types/ApiResponse';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobDetailsForLawyerDTO } from '../../../types/Jobs/JobDetailsDTO';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css',
})
export class JobDetailsComponent {
  ApiService: JobsService;
  job: JobDetailsForLawyerDTO = {} as JobDetailsForLawyerDTO;
  id: number = 0;
  constructor(
    private jobsService: JobsService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.ApiService = jobsService;
    this.id = this.activeRoute.snapshot.params['id'];
  }
  userId: string = '';
  role: string = '';
  isClient: boolean = false;
  isLawyer: boolean = false;
  foreignKey: number = 0;
  myJob: boolean = false;
  alreadyApplied: boolean = false; // for future use

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.userId = userInfo.userId;
      this.foreignKey = userInfo.foreignKey;
      this.role = userInfo.role;
      this.isClient = this.role === 'Client';
      this.isLawyer = this.role === 'Lawyer';
    }
    console.log(`User ID: ${this.userId}`);
    console.log(`Foreign Key: ${this.foreignKey}`);
    console.log(`Role: ${this.role}`);
    console.log(`isClient: ${this.isClient}`);
    console.log(`isLawyer: ${this.isLawyer}`);

    this.loadData(this.id);
  }

  loadData(id: number): void {
    this.ApiService.GetJob(this.id).subscribe({
      next: (res: ApiResponse<JobDetailsForLawyerDTO>) => {
        this.job = res.data; // actual job list
        this.myJob = this.job.clientId === this.foreignKey;
        console.log(`My job: ${this.myJob}`);
        console.log(res);
      },

      error: (err: any) => {
        console.error('Failed to load jobs:', err);
      },
    });
  }
}
