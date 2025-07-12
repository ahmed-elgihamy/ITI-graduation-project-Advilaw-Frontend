import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultationService } from '../../../core/services/consultation.service';
import { AuthService } from '../../../core/services/auth.service';
import { JobListDTO } from '../../../types/Jobs/JobListDTO';
import { JobStatus } from '../../../types/Jobs/JobStatus';
import { PagedResponse } from '../../../types/PagedResponse';
import { ApiResponse } from '../../../types/ApiResponse';

@Component({
  selector: 'app-consultations-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultations-content.component.html',
  styleUrl: './consultations-content.component.css'
})
export class ConsultationsContentComponent implements OnInit {
  consultations: JobListDTO[] = [];
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 10;
  loading = false;
  error = '';

  // Rejection modal
  showRejectModal = false;
  selectedConsultation: JobListDTO | null = null;
  rejectReason = '';

  constructor(
    private consultationService: ConsultationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkAuthenticationAndLoad();
  }

  checkAuthenticationAndLoad(): void {
    const userInfo = this.authService.getUserInfo();
    const token = this.authService.getToken();

    console.log('User info:', userInfo);
    console.log('Token exists:', !!token);
    console.log('User ID from token:', userInfo?.userId);
    console.log('User role:', userInfo?.role);

    if (!token) {
      this.error = 'No authentication token found. Please login again.';
      return;
    }

    if (!userInfo) {
      this.error = 'User information not found. Please login again.';
      return;
    }

    if (userInfo.role !== 'Lawyer') {
      this.error = 'Access denied. Only lawyers can view consultations.';
      return;
    }

    // Check if user ID is valid (GUID string)
    if (!userInfo.userId || userInfo.userId.trim() === '') {
      this.error = 'Invalid user ID. Please login again.';
      return;
    }

    console.log('Authentication check passed. Loading consultations...');
    console.log('Sending user ID to backend:', userInfo.userId);
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.loading = true;
    this.error = '';

    console.log('Loading consultations for page:', this.currentPage);
    console.log('Page size:', this.pageSize);

    this.consultationService.getConsultationsForLawyer(this.currentPage, this.pageSize).subscribe({
      next: (response: ApiResponse<PagedResponse<JobListDTO>>) => {
        console.log('Consultations response:', response);
        console.log('Response details:', {
          succeeded: response.succeeded,
          statusCode: response.statusCode,
          message: response.message,
          hasData: !!response.data,
          dataType: typeof response.data,
          dataKeys: response.data ? Object.keys(response.data) : 'null'
        });

        if (response.succeeded && response.data) {
          // Backend returns PagedResponse directly in data property
          this.consultations = response.data.data || [];
          this.totalItems = response.data.totalRecords || 0;
          this.totalPages = response.data.totalPages || 1;

          console.log('Loaded consultations:', this.consultations);
          console.log('Consultation details:', this.consultations.map(c => ({
            id: c.id,
            header: c.header,
            clientName: c.clientName,
            status: c.status,
            type: c.type
          })));
          console.log('Pagination info:', {
            totalItems: this.totalItems,
            totalPages: this.totalPages,
            currentPage: this.currentPage,
            consultationsCount: this.consultations.length
          });

          // Clear any previous errors
          this.error = '';
        } else {
          this.error = response.message || 'Failed to load consultations';
          console.error('Failed to load consultations:', response.message);
          this.consultations = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading consultations:', err);
        this.error = err.message || 'Error loading consultations';
        this.loading = false;
        this.consultations = [];
        this.totalItems = 0;
        this.totalPages = 1;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadConsultations();
  }

  acceptConsultation(consultation: JobListDTO): void {
    if (!consultation.id) {
      alert('Consultation ID is missing.');
      return;
    }
    if (confirm(`Are you sure you want to accept the consultation for "${consultation.header}"?`)) {
      console.log('Accepting consultation:', consultation.id);
      console.log('Consultation details:', {
        id: consultation.id,
        header: consultation.header,
        clientName: consultation.clientName
      });
      this.consultationService.acceptConsultation(consultation.id).subscribe({
        next: (response: ApiResponse<boolean>) => {
          console.log('Accept consultation response:', response);
          if (response.succeeded) {
            alert('Consultation accepted successfully!');
            consultation.status = 'Accepted' as JobStatus;


            this.loadConsultations(); // Reload the list
          } else {
            alert(response.message || 'Failed to accept consultation');
          }
        },
        error: (err) => {
          alert('Error accepting consultation');
          console.error('Error accepting consultation:', err);
        }
      });
    }
  }

  openRejectModal(consultation: JobListDTO): void {
    this.selectedConsultation = consultation;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedConsultation = null;
    this.rejectReason = '';
  }

  rejectConsultation(): void {
    if (!this.selectedConsultation || !this.rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    if (!this.selectedConsultation.id) {
      alert('Consultation ID is missing.');
      return;
    }
    console.log('Rejecting consultation:', this.selectedConsultation.id, 'with reason:', this.rejectReason);
    console.log('Selected consultation details:', {
      id: this.selectedConsultation.id,
      header: this.selectedConsultation.header,
      clientName: this.selectedConsultation.clientName
    });
    this.consultationService.rejectConsultation(this.selectedConsultation.id, this.rejectReason).subscribe({
      next: (response: ApiResponse<boolean>) => {
        console.log('Reject consultation response:', response);
        if (response.succeeded) {
          alert('Consultation rejected successfully!');
          this.closeRejectModal();
          this.loadConsultations(); // Reload the list
        } else {
          alert(response.message || 'Failed to reject consultation');
        }
      },
      error: (err) => {
        alert('Error rejecting consultation');
        console.error('Error rejecting consultation:', err);
      }
    });
  }

  getStatusBadgeClass(status: JobStatus): string {
    switch (status) {
      case JobStatus.Accepted:
        return 'badge bg-success';
      case JobStatus.Rejected:
        return 'badge bg-danger';
      default:
        return 'badge bg-warning';
    }
  }

  getStatusText(status: JobStatus): string {
    if (status === JobStatus.WaitingAppointment || status === JobStatus.NotAssigned) {
      return 'Pending';
    }
    if (status === JobStatus.Accepted) {
      return 'Accepted';
    }
    if (status === JobStatus.Rejected) {
      return 'Rejected';
    }
    // Optionally, handle other statuses or return the raw status
    return status;
  }

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  }

  // Helper method to check if consultations are empty
  get hasConsultations(): boolean {
    return this.consultations && this.consultations.length > 0;
  }

  // Helper method to get consultation count
  get consultationCount(): number {
    return this.consultations ? this.consultations.length : 0;
  }

  testApiConnection(): void {
    console.log('=== Testing API Connection ===');
    console.log('Current user info:', this.authService.getUserInfo());
    console.log('Current token:', this.authService.getToken());

    // First check authentication
    const userInfo = this.authService.getUserInfo();
    const token = this.authService.getToken();

    console.log('Authentication check:', {
      hasToken: !!token,
      userInfo: userInfo,
      role: userInfo?.role,
      userId: userInfo?.userId,
      userIdType: typeof userInfo?.userId
    });

    this.consultationService.testApiConnection().subscribe({
      next: (response: ApiResponse<PagedResponse<JobListDTO>>) => {
        console.log('API test successful:', response);
        console.log('Response structure:', {
          succeeded: response.succeeded,
          statusCode: response.statusCode,
          message: response.message,
          dataType: typeof response.data,
          dataKeys: response.data ? Object.keys(response.data) : 'null',
          dataStructure: response.data,
          consultationsCount: response.data?.data?.length || 0
        });

        if (response.succeeded) {
          alert(`API connection test successful!\nFound ${response.data?.data?.length || 0} consultations.\nCheck console for details.`);
        } else {
          alert(`API test failed: ${response.message}`);
        }
      },
      error: (error) => {
        console.error('API test failed:', error);
        alert(`API connection test failed: ${error.message}`);
      }
    });
  }

  // Helper to cast string to JobStatus enum
  asJobStatus(status: string | undefined): JobStatus {
    if (!status) return JobStatus.WaitingAppointment;
    return status as JobStatus;
  }
} 