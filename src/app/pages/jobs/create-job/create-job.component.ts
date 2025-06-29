import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobsService } from '../../../core/services/jobs.service';
import { JobFieldsService } from '../../../core/services/job-fields.service';
import { JobFieldDTO } from '../../../types/JobFields/JobFieldsDTO';
import { Router, RouterLink } from '@angular/router';
import { JobType } from '../../../types/Jobs/JobType';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class CreateJobComponent implements OnInit {
  jobForm!: FormGroup;
  jobFields: JobFieldDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private jobFieldsService: JobFieldsService,
    private jobsService: JobsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      header: ['', Validators.required],
      description: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(1)]],
      type: [JobType.ClientPublishing, Validators.required],
      isAnonymus: [false],
      jobFieldId: [null, Validators.required],
    });

    this.jobFieldsService.GetJobFields().subscribe({
      next: (res: any) => {
        this.jobFields = res.data;
        console.log(res);
      },
      error: (err: any) => {
        console.error('Failed to load job fields', err);
      },
    });
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      const requestData = this.jobForm.value;
      console.log('Sending CreateJobDTO:', requestData);

      this.jobsService.CreateJob(requestData).subscribe({
        next: (res: any) => {
          console.log('Job created:', res);
          this.router.navigate(['/jobs']);
        },
        error: (err: any) => {
          console.error('Error creating job:', err);
        },
      });
    } else {
      this.jobForm.markAllAsTouched(); // mark all controls to trigger errors
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.jobForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
