import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobsService } from '../../../core/services/jobs.service';
import { ClientService } from '../../../core/services/client.service';
import { JobStatus } from '../../../types/Jobs/JobStatus';
import { JobDetailsForLawyerDTO } from '../../../types/Jobs/JobDetailsDTO';
import { PagedResponse } from '../../../types/PagedResponse';
import { ApiResponse } from '../../../types/ApiResponse';

@Component({
  selector: 'app-client-consults',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-consults.component.html',
  styleUrl: './client-consults.component.css'
})
export class ClientConsultsComponent implements OnInit {
  jobs: JobDetailsForLawyerDTO[] = [];
  filteredJobs: JobDetailsForLawyerDTO[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalItems = 0;
  isLoading = false;
  error = '';

  // Filter properties
  selectedStatus: string = 'all';
  searchTerm: string = '';
  selectedField: string = 'all';

  // Statistics
  statistics = {
    total: 0,
    completed: 0,
    pending: 0,
    active: 0,
    totalBudget: 0
  };

  // Available filters
  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: JobStatus.NotAssigned, label: 'Not Assigned' },
    { value: JobStatus.WaitingAppointment, label: 'Waiting Appointment' },
    { value: JobStatus.WaitingPayment, label: 'Waiting Payment' },
    { value: JobStatus.NotStarted, label: 'Not Started' },
    { value: JobStatus.LawyerRequestedAppointment, label: 'Lawyer Requested Appointment' },
    { value: JobStatus.ClientRequestedAppointment, label: 'Client Requested Appointment' },
    { value: JobStatus.Started, label: 'Started' },
    { value: JobStatus.Ended, label: 'Completed' }
  ];

  jobFields: string[] = [];

  // Expose JobStatus enum to template
  JobStatus = JobStatus;

  constructor(
    private jobsService: JobsService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    this.loadStatistics();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.error = '';

    this.jobsService.GetJobs(this.currentPage).subscribe({
      next: (response: ApiResponse<PagedResponse<JobDetailsForLawyerDTO>>) => {
        const pagedData = response.data;
        this.jobs = pagedData.data;
        this.totalPages = pagedData.totalPages;
        this.pageSize = pagedData.pageSize;
        this.currentPage = pagedData.pageNumber;
        this.totalItems = pagedData.totalRecords;
        this.extractJobFields();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.error = 'Failed to load jobs. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadStatistics(): void {
     this.clientService.getClientJobs().subscribe({
       next: (response) => {
        
         this.updateStatistics();
       },
       error: (error) => {
         console.error('Error loading statistics:', error);
       }
     });
  }

  updateStatistics(): void {
    this.statistics.total = this.jobs.length;
    this.statistics.completed = this.jobs.filter(job => job.status === JobStatus.Ended).length;
    this.statistics.pending = this.jobs.filter(job => 
      job.status === JobStatus.WaitingAppointment || 
      job.status === JobStatus.WaitingPayment ||
      job.status === JobStatus.NotStarted ||
      job.status === JobStatus.NotAssigned
    ).length;
    this.statistics.active = this.jobs.filter(job => 
      job.status === JobStatus.Started || 
      job.status === JobStatus.LawyerRequestedAppointment ||
      job.status === JobStatus.ClientRequestedAppointment
    ).length;
    this.statistics.totalBudget = this.jobs.reduce((sum, job) => sum + job.budget, 0);
  }

  extractJobFields(): void {
    const fields = new Set<string>();
    this.jobs.forEach(job => {
      if (job.jobFieldName) {
        fields.add(job.jobFieldName);
      }
    });
    this.jobFields = Array.from(fields).sort();
  }

  applyFilters(): void {
    console.log('Applying filters:', {
      selectedStatus: this.selectedStatus,
      searchTerm: this.searchTerm,
      selectedField: this.selectedField,
      totalJobs: this.jobs.length
    });

    this.filteredJobs = this.jobs.filter(job => {
      // Status filter
      const matchesStatus = this.selectedStatus === 'all' || job.status === this.selectedStatus;
      
      // Search filter - search in header, description, and lawyer name
      const searchLower = this.searchTerm.toLowerCase().trim();
      const matchesSearch = !searchLower || 
        (job.header && job.header.toLowerCase().includes(searchLower)) ||
        (job.description && job.description.toLowerCase().includes(searchLower)) ||
        (job.clientName && job.clientName.toLowerCase().includes(searchLower));
      
      // Field filter
      const matchesField = this.selectedField === 'all' || 
        (job.jobFieldName && job.jobFieldName === this.selectedField);
      
      const matches = matchesStatus && matchesSearch && matchesField;
      
      if (!matches && searchLower) {
        console.log('Job filtered out:', {
          id: job.id,
          header: job.header,
          status: job.status,
          field: job.jobFieldName,
          matchesStatus,
          matchesSearch,
          matchesField
        });
      }
      
      return matches;
    });

    console.log('Filtered results:', this.filteredJobs.length);
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFieldFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedStatus = 'all';
    this.searchTerm = '';
    this.selectedField = 'all';
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadJobs();
  }

  getStatusBadgeClass(status: JobStatus): string {
    switch (status) {
      case JobStatus.NotAssigned:
        return 'badge bg-secondary';
      case JobStatus.WaitingAppointment:
      case JobStatus.WaitingPayment:
        return 'badge bg-warning text-dark';
      case JobStatus.NotStarted:
        return 'badge bg-info';
      case JobStatus.LawyerRequestedAppointment:
      case JobStatus.ClientRequestedAppointment:
        return 'badge bg-primary';
      case JobStatus.Started:
        return 'badge bg-success';
      case JobStatus.Ended:
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusLabel(status: JobStatus): string {
    switch (status) {
      case JobStatus.NotAssigned:
        return 'Not Assigned';
      case JobStatus.WaitingAppointment:
        return 'Waiting Appointment';
      case JobStatus.WaitingPayment:
        return 'Waiting Payment';
      case JobStatus.NotStarted:
        return 'Not Started';
      case JobStatus.LawyerRequestedAppointment:
        return 'Lawyer Requested Appointment';
      case JobStatus.ClientRequestedAppointment:
        return 'Client Requested Appointment';
      case JobStatus.Started:
        return 'In Progress';
      case JobStatus.Ended:
        return 'Completed';
      default:
        return status;
    }
  }

  getProposalsCount(job: JobDetailsForLawyerDTO): number {
    return job.proposals?.length || 0;
  }

  getAppointmentsCount(job: JobDetailsForLawyerDTO): number {
    return job.appointments?.length || 0;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
