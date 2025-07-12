import { UserInfo } from './../../../types/UserInfo';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobFieldsService } from '../../../core/services/job-fields.service';
import { JobsService } from '../../../core/services/jobs.service';
import { LawyerService } from '../../../core/services/lawyer.service';
import { AuthService } from '../../../core/services/auth.service';
import { JobFieldDTO } from '../../../types/JobFields/JobFieldsDTO';
import { JobType } from '../../../types/Jobs/JobType';
import { LawyerProfile } from '../../../components/models/LawyerProfile';
import ValidateForm from '../../../components/helpers/ValidationForm';

@Component({
  selector: 'app-lawyer-consultation',
  standalone: true,
  templateUrl: './lawyer-consultation.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class LawyerConsultationComponent implements OnInit {
  jobForm!: FormGroup;
  jobFields: JobFieldDTO[] = [];
  lawyerId!: string;
  lawyerProfile: LawyerProfile | null = null;
  hourlyRate = 0;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  isLawyer = false;
  isClient = false;
  userInfo: UserInfo | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobFieldsService: JobFieldsService,
    private jobsService: JobsService,
    private lawyerService: LawyerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      const id = params.get('lawyerId');

      if (id) {
        this.lawyerId = id;
        this.lawyerService.getHourlyRate(this.lawyerId).subscribe({
          next: (res: any) => {
            console.log(res);
            this.hourlyRate = res.data.hourlyRate;
            console.log(this.hourlyRate);
            this.isLoading = false;
            this.buildForm();
          },
          error: () => {
            this.errorMessage = 'Could not load hourly rate.';
            this.hourlyRate = 0;
            this.isLoading = false;
            this.buildForm();
          },
        });
        this.loadJobFields();
      } else {
        this.errorMessage = 'Lawyer ID not found in route';
        this.isLoading = false;
      }
    });
    this.userInfo = this.authService.getUserInfo();
    this.isLawyer = this.userInfo?.role === 'Lawyer';
    this.isClient = this.userInfo?.role === 'Client';
  }

  loadJobFields(): void {
    this.jobFieldsService.GetJobFields().subscribe({
      next: (res: any) => {
        this.jobFields = res.data || [];
        console.log('Loaded job fields:', this.jobFields);
      },
      error: (err) => {
        console.error('Failed to load job fields', err);
        // Don't set error message here as it might override lawyer profile error
        this.jobFields = [];
      },
    });
  }

  buildForm(): void {
    this.jobForm = this.fb.group({
      header: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1000),
        ],
      ],
      appointmentTime: ['', [Validators.required, this.futureDateValidator()]],
      // startTime: ['', [Validators.required]],
      // endTime: ['', [Validators.required]],
      durationHours: [
        0,
        [Validators.required, Validators.min(0.5), Validators.max(8)],
      ],
      budget: [0, [Validators.required, Validators.min(1)]],
      isAnonymus: [false],
      jobFieldId: [null, [Validators.required]],
      type: [JobType.LawyerProposal],
      lawyerId: [parseInt(this.lawyerId)],
    });

    // Subscribe to time changes for automatic calculation
    // this.jobForm.get('startTime')?.valueChanges.subscribe(() =>
    //   this.calculateDurationAndBudget()
    // );
    // this.jobForm.get('endTime')?.valueChanges.subscribe(() =>
    //   this.calculateDurationAndBudget()
    // );
    this.jobForm
      .get('appointmentTime')
      ?.valueChanges.subscribe(() => this.calculateDurationAndBudget());

    this.jobForm
      .get('durationHours')
      ?.valueChanges.subscribe(() => this.calculateDurationAndBudget());

    this.jobForm
      .get('budget')
      ?.valueChanges.subscribe(() => this.calculateDurationAndBudget());
  }

  futureDateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;

      const selectedDate = new Date(control.value);
      const now = new Date();

      if (selectedDate <= now) {
        return { futureDate: { value: control.value } };
      }

      return null;
    };
  }

  calculateDurationAndBudget(): void {
    const appointmentDateStr = this.jobForm.get('appointmentTime')?.value;
    const duration = this.jobForm.get('durationHours')?.value;

    if (!appointmentDateStr || !duration) return;

    const appointmentDate = new Date(appointmentDateStr);
    if (appointmentDate.getTime() > Date.now()) {
      const budget = Math.ceil(this.hourlyRate * duration);
      // console.log(`Hourly: ${this.hourlyRate}`);
      // console.log(`Duration: ${duration}`);
      this.jobForm.patchValue({ budget }, { emitEvent: false });
    }

    console.log(
      `Duration: ${duration}, Budget: ${this.jobForm.get('budget')?.value}`
    );
  }

  // calculateDurationAndBudget(): void {
  //   // const startValue = this.jobForm.get('startTime')?.value;
  //   // const endValue = this.jobForm.get('endTime')?.value;
  //   const duration = this.jobForm.get('durationHours')?.value;

  //   if (!duration) return;

  //   // const start = new Date(`1970-01-01T${startValue}`);
  //   // const end = new Date(`1970-01-01T${endValue}`);

  //   if (appointmentTime.getTime() > Date.now()) {
  //     const diffMs = end.getTime() - start.getTime();
  //     const hours = diffMs / (1000 * 60 * 60);

  //     if (hours >= 0.5 && hours <= 8) {
  //       this.jobForm.patchValue(
  //         {
  //           // durationHours: Math.round(hours * 10) / 10, // Round to 1 decimal place
  //           budget: Math.ceil(this.hourlyRate * hours),
  //         },
  //         { emitEvent: false }
  //       );
  //     }
  //   }
  // }

  isInvalid(controlName: string): boolean {
    const control = this.jobForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.jobForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required'])
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } is required.`;
    if (control.errors['minlength'])
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } must be at least ${
        control.errors['minlength'].requiredLength
      } characters.`;
    if (control.errors['maxlength'])
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } must not exceed ${
        control.errors['maxlength'].requiredLength
      } characters.`;
    if (control.errors['min'])
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } must be at least ${control.errors['min'].min}.`;
    if (control.errors['max'])
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } must not exceed ${control.errors['max'].max}.`;
    if (control.errors['futureDate'])
      return 'Appointment time must be in the future.';

    return 'Invalid input.';
  }

  onSubmit(): void {
    console.log('Form submitted. Form valid:', this.jobForm.valid);
    console.log('Form values:', this.jobForm.value);

    if (this.jobForm.invalid) {
      console.log('Form is invalid. Marking all fields as touched.');
      ValidateForm.validateAllFormsFields(this.jobForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.jobForm.value;

    // Combine date and time for appointment
    let appointmentDate: Date;
    try {
      appointmentDate = new Date(formData.appointmentTime);
      console.log(appointmentDate);
      // const [hours, minutes] = formData.startTime.split(':');
      // appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      console.log('Combined date and time:', appointmentDate);

      // Validate the appointment date is in the future
      if (appointmentDate <= new Date()) {
        this.errorMessage = 'Appointment time must be in the future.';
        this.isSubmitting = false;
        return;
      }
    } catch (error) {
      console.error('Error parsing appointment date/time:', error);
      this.errorMessage = 'Invalid appointment date or time format.';
      this.isSubmitting = false;
      return;
    }

    // Get user ID from auth service
    const userInfo = this.authService.getUserInfo();
    if (!userInfo?.userId) {
      this.errorMessage = 'User not authenticated. Please log in again.';
      this.isSubmitting = false;
      return;
    }

    // Validate required fields
    if (
      !formData.header ||
      !formData.description ||
      !formData.appointmentTime ||
      // !formData.startTime ||
      // !formData.endTime ||
      !formData.jobFieldId ||
      !formData.lawyerId
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      this.isSubmitting = false;
      return;
    }

    // Prepare the data according to backend expectations
    const jobData = {
      header: formData.header,
      description: formData.description,
      budget: formData.budget,
      type: formData.type,
      isAnonymus: formData.isAnonymus,
      jobFieldId: formData.jobFieldId,
      lawyerId: formData.lawyerId,
      appointmentTime: appointmentDate.toISOString(), // Format as ISO string for backend
      durationHours: formData.durationHours,
      UserId: userInfo.userId, // Add user ID for backend (capital U to match C# property)
    };

    console.log('Submitting job data:', jobData);
    console.log('Form validation status:', this.jobForm.valid);
    console.log('Form errors:', this.jobForm.errors);
    console.log('Individual field errors:', {
      header: this.jobForm.get('header')?.errors,
      description: this.jobForm.get('description')?.errors,
      appointmentTime: this.jobForm.get('appointmentTime')?.errors,
      // startTime: this.jobForm.get('startTime')?.errors,
      // endTime: this.jobForm.get('endTime')?.errors,
      durationHours: this.jobForm.get('durationHours')?.errors,
      budget: this.jobForm.get('budget')?.errors,
      jobFieldId: this.jobForm.get('jobFieldId')?.errors,
      lawyerId: this.jobForm.get('lawyerId')?.errors,
    });

    this.jobsService.CreateJob(jobData).subscribe({
      next: (response) => {
        console.log('Job created successfully:', response);
        this.successMessage = 'Consultation request submitted successfully!';
        this.isSubmitting = false;

        // Navigate to client consults page after a short delay

        // Navigate to jobs page after a short delay

        setTimeout(() => {
          this.router.navigate(['/client/consults']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error creating job:', err);
        this.errorMessage =
          err.error?.message ||
          'Failed to submit consultation request. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/allLawyers']);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  scrollToForm(): void {
    const formSection = document.querySelector('.consultation-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
