import { EscrowService } from './../../../core/services/escrow.service';
import { Component, NgModule } from '@angular/core';
import { JobsService } from '../../../core/services/jobs.service';
import { ApiResponse } from '../../../types/ApiResponse';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { AppointmentType } from '../../../types/Appointments/AppointmentType';
import { AppointmentStatus } from '../../../types/Appointments/AppointmentStatus';
import { AppointmentDetailsDTO } from '../../../types/Appointments/AppointmentDetailsDTO';
import { JobStatus } from '../../../types/Jobs/JobStatus';
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
  AppointmentType = AppointmentType;
  AppointmentStatus = AppointmentStatus;
  isJobAssigned: boolean = false;

  constructor(
    private jobsService: JobsService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private EscrowService: EscrowService
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
  canMakeAppointment: boolean = false;
  canAcceptAppointment: boolean = false;
  canMakeProposal: boolean = false;
  escrowId: number = 0;
  checkoutUrl: string = '';
  canMakePayment: boolean = false;

  //For Appointment
  showAppointmentModal = false;
  selectedDate: Date = new Date();
  ScheduleId: number = 0;

  showAppointmentActionModal = false;
  lastAppointment: AppointmentDetailsDTO | null = null;

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.userId = userInfo.userId;
      this.foreignKey = userInfo.foreignKey;
      this.role = userInfo.role;
      this.isClient = this.role === 'Client';
      this.isLawyer = this.role === 'Lawyer';
    }
    // console.log(`User ID: ${this.userId}`);
    // console.log(`Foreign Key: ${this.foreignKey}`);
    // console.log(`Role: ${this.role}`);
    // console.log(`isClient: ${this.isClient}`);
    // console.log(`isLawyer: ${this.isLawyer}`);

    this.loadData(this.id);
    this.initializeForm();
  }
  initializeForm(): void {
    this.proposalForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]],
      budget: [null, [Validators.required, Validators.min(1)]],
    });
  }

  getAppointmentTypeLabel(type: AppointmentType): string {
    return AppointmentType[type];
  }

  getAppointmentStatusLabel(status: AppointmentStatus): string {
    return AppointmentStatus[status];
  }

  openAppointmentModal() {
    const modalEl = document.getElementById('appointmentModal');
    if (modalEl) {
      new bootstrap.Modal(modalEl).show();
    }
  }
  MakeAppointment() {
    this.ApiService.MakeAppointment(this.id, {
      date: this.selectedDate,
      scheduleId: this.ScheduleId,
    }).subscribe({
      next: (res) => {
        console.log('Appointment created:', res);
        this.closeMakeAppointmentModal();
        this.loadData(this.id);
      },
      error: (err) => {
        console.error('Failed to create appointment:', err);
      },
    });
  }

  loadData(id: number): void {
    this.ApiService.GetJob(this.id).subscribe({
      next: (res: ApiResponse<JobDetailsForLawyerDTO>) => {
        this.job = res.data; // actual job list
        this.myJob = this.job.clientId === this.foreignKey;
        this.isJobAssigned = this.job.lawyerId !== null;
        if (this.isLawyer && this.job.status === JobStatus.NotAssigned) {
          this.canMakeProposal = true;
        }
        if (this.isClient && this.job.status === JobStatus.WaitingAppointment) {
          this.canAcceptAppointment = false;
          this.canMakeAppointment = true;
        }
        if (
          (this.job.status === JobStatus.ClientRequestedAppointment &&
            this.isLawyer) ||
          (this.job.status === JobStatus.LawyerRequestedAppointment &&
            this.isClient)
        ) {
          this.canAcceptAppointment = true;
          this.canMakeAppointment = false;
          console.log(`Status: ${this.job.status}, Client: ${this.isClient}`);
        }
        console.log(`My job: ${this.myJob}`);
        console.log(res);
        if (this.job.appointments?.length > 0) {
          if (
            this.job.status === JobStatus.ClientRequestedAppointment ||
            this.job.status === JobStatus.LawyerRequestedAppointment
          ) {
            this.lastAppointment =
              this.job.appointments[this.job.appointments.length - 1];
            console.log(this.lastAppointment);
            if (
              (this.isLawyer &&
                this.lastAppointment.type === AppointmentType.FromClient) ||
              (this.isClient &&
                this.lastAppointment.type === AppointmentType.FromLawyer)
            ) {
              console.log('object');
              this.showReplyToLastAppointmentModal();
            }
          }
        }
        if (this.isClient && this.job.status === JobStatus.WaitingAppointment) {
          this.openMakeAppointmentModal();
        }
        if (this.isClient && this.job.status === JobStatus.WaitingPayment) {
          this.canMakePayment = true;
        }
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
        this.loadData(this.id);
      },
      error: (err) => console.error('Error applying to job:', err),
    });
  }

  makePayment() {
    if (this.isClient) {
      this.EscrowService.createSessionPayment({
        jobId: this.job.id,
        clientId: this.userId,
      }).subscribe({
        next: (res) => {
          console.log('Payment API response:', res);
          if (res && res.checkoutUrl) {
            this.escrowId = res.escrowId;
            this.checkoutUrl = res.checkoutUrl;
            window.location.href = this.checkoutUrl;
          } else {
            alert('Failed to initiate payment.');
            console.error('Payment response error:', res);
          }
        },
      });
    }
  }

  acceptAppointment(appointment: AppointmentDetailsDTO | null): void {
    this.ApiService.AcceptAppointment(appointment?.id).subscribe({
      next: (res: any) => {
        console.log('Appointment accepted:', res);
        this.makePayment();
        this.closeMakeAppointmentModal();
        this.loadData(this.id);
        this.canAcceptAppointment = false;
      },
      error: (err: any) => {
        console.error('Failed to accept appointment:', err);
      },
    });
  }

  openMakeAppointmentModal() {
    const modal = new bootstrap.Modal(
      document.getElementById('appointmentModal')!
    );
    modal.show();
  }

  closeMakeAppointmentModal() {
    const modal = new bootstrap.Modal(
      document.getElementById('appointmentModal')!
    );
    modal.hide();
  }

  showReplyToLastAppointmentModal() {
    this.showAppointmentActionModal = true;
    const modal = new bootstrap.Modal(
      document.getElementById('appointmentActionModal')!
    );
    modal.show();
  }
}
