import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminFundReleasesService, SessionData } from '../../../core/services/admin/admin-fund-releases.service';
import { ApiResponse } from '../../../types/ApiResponse';

@Component({
  selector: 'app-admin-fund-releases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-fund-releases.component.html',
  styleUrl: './admin-fund-releases.component.css'
})
export class AdminFundReleasesComponent implements OnInit {
  sessions: SessionData[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(private adminFundReleasesService: AdminFundReleasesService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.error = '';

    this.adminFundReleasesService.getCompletedSessions().subscribe({
      next: (response: ApiResponse<SessionData[]>) => {
        this.loading = false;
        if (response.succeeded && response.data) {
          this.sessions = response.data;
        } else {
          this.error = response.message || 'Failed to load sessions';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Failed to load sessions. Please try again.';
        console.error('Error loading sessions:', err);
      }
    });
  }

  releaseFunds(sessionId: number): void {
    if (confirm(`Are you sure you want to release funds for session ${sessionId}?`)) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      this.adminFundReleasesService.releaseSessionFunds(sessionId).subscribe({
        next: (response: ApiResponse<any>) => {
          this.loading = false;
          if (response.succeeded) {
            this.successMessage = 'Funds released successfully!';

            this.sessions = this.sessions.filter(session => session.sessionId !== sessionId);
          } else {
            this.error = response.message || 'Failed to release funds';
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.error = 'Failed to release funds. Please try again.';
          console.error('Error releasing funds:', err);
        }
      });
    }
  }

  clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }

  formatCurrency(amount: number): string {
    return `EGP ${amount.toFixed(2)}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 