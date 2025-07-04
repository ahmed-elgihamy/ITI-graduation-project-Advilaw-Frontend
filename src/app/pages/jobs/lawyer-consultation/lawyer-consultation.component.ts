import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobFieldsService } from '../../../core/services/job-fields.service';
import { JobsService } from '../../../core/services/jobs.service';
import { JobFieldDTO } from '../../../types/JobFields/JobFieldsDTO';
import { JobType } from '../../../types/Jobs/JobType';
import { LawyerService } from '../../../services/lawyer.service';

@Component({
  selector: 'app-lawyer-consultation',
  standalone: true,
  templateUrl: './lawyer-consultation.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class LawyerConsultationComponent implements OnInit {
  jobForm!: FormGroup;
  jobFields: JobFieldDTO[] = [];
  lawyerId!: string;
  hourlyRate = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobFieldsService: JobFieldsService,
    private jobsService: JobsService,
    private lawyerService: LawyerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('lawyerId');
      console.log('Captured lawyerId from route:', id);

      if (id) {
        this.lawyerId = id;
        this.buildForm();
        this.loadFields();
        this.loadLawyerRate();
      } else {
        console.error('No lawyerId in route');
      }
    });
  }

  buildForm(): void {
    this.jobForm = this.fb.group({
      header: ['', Validators.required],
      description: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      durationHours: [0, Validators.required],
      budget: [0, Validators.required],
      isAnonymus: [false],
      jobFieldId: [null, Validators.required],
      type: [JobType.LawyerProposal],
      lawyerId: [this.lawyerId],
    });

    this.jobForm.get('startTime')?.valueChanges.subscribe(() =>
      this.calculateDurationAndBudget()
    );
    this.jobForm.get('endTime')?.valueChanges.subscribe(() =>
      this.calculateDurationAndBudget()
    );
  }

  loadFields(): void {
    this.jobFieldsService.GetJobFields().subscribe({
      next: (res: any) => (this.jobFields = res.data),
      error: (err) => console.error('Failed to load job fields', err),
    });
  }

 loadLawyerRate(): void {
  this.lawyerService.getProfile(this.lawyerId).subscribe({
    next: (profile) => {
      if (profile && profile.hourlyRate) {
        this.hourlyRate = profile.hourlyRate;
        console.log('Loaded hourly rate:', this.hourlyRate);
      } else {
        console.warn('Lawyer profile is null or hourlyRate missing. Using default.');
        this.hourlyRate = 500;
      }
      this.calculateDurationAndBudget();
    },
    error: (err) => {
      console.error('Failed to load lawyer profile', err);
      this.hourlyRate = 500;
      this.calculateDurationAndBudget();
    },
  });
}


  calculateDurationAndBudget(): void {
    const startValue = this.jobForm.get('startTime')?.value;
    const endValue = this.jobForm.get('endTime')?.value;

    if (!startValue || !endValue) return;

    const start = new Date(`1970-01-01T${startValue}`);
    const end = new Date(`1970-01-01T${endValue}`);

    if (end > start) {
      const diffMs = end.getTime() - start.getTime();
      const hours = diffMs / (1000 * 60 * 60);

      this.jobForm.patchValue(
        {
          durationHours: hours,
          budget: this.hourlyRate * hours,
        },
        { emitEvent: false }
      );
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.jobForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const formData = this.jobForm.value;

    this.jobsService.CreateJob(formData).subscribe({
      next: () => this.router.navigate(['/jobs']),
      error: (err) => console.error('Error creating job:', err),
    });
  }
}
