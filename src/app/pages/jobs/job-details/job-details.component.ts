import { Component, NgModule } from '@angular/core';
import { JobsService } from '../../../core/services/jobs.service';
import { ApiResponse } from '../../../types/ApiResponse';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobDetailsForLawyerDTO } from '../../../types/Jobs/JobDetailsDTO';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css',
})
export class JobDetailsComponent {
  proposalForm!: FormGroup;
  ApiService: JobsService;
  job: JobDetailsForLawyerDTO = {} as JobDetailsForLawyerDTO;
  id: number = 0;
  constructor(
    private jobsService: JobsService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
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
    this.initializeForm();
  }
  initializeForm(): void {
    this.proposalForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]],
      budget: [null, [Validators.required, Validators.min(1)]],
    });
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

  submitProposal(): void {
    if (this.proposalForm.invalid) {
      this.proposalForm.markAllAsTouched();
      return;
    }

    const proposalData = {
      jobId: this.id,
      content: this.proposalForm.value.content,
      budget: this.proposalForm.value.budget,
    };

    this.ApiService.ApplyToJob(proposalData).subscribe({
      next: (res) => {
        console.log('Job applied:', res);
        // Optionally reset form and hide modal
        this.proposalForm.reset();
        const modalElement = document.getElementById('createProposalModal');
        const modal = bootstrap.Modal.getInstance(modalElement!);
        modal?.hide();
      },
      error: (err) => console.error('Error applying to job:', err),
    });
  }
}
