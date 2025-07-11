import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSessionHistoryService, SessionHistoryData } from '../../../core/services/admin/admin-session-history.service';

import { ApiResponse } from '../../../types/ApiResponse';

@Component({
  selector: 'app-admin-session-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-session-history.component.html',
  styleUrl: './admin-session-history.component.css'
})
export class AdminSessionHistoryComponent implements OnInit {
  sessions: SessionHistoryData[] = [];
  loading = false;
  error = '';

  constructor(private AdminSessionHistoryService: AdminSessionHistoryService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.error = '';

    this.AdminSessionHistoryService.getSessionHistory().subscribe({
      next: (response: ApiResponse<SessionHistoryData[]>) => {
        this.loading = false;
        if (response.succeeded && response.data) {
          this.sessions = response.data;
        } else {
          this.error = response.message || 'Failed to load session history';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Failed to load session history. Please try again.';
        console.error('Error loading session history:', err);
      }
    });
  }

  clearMessages(): void {
    this.error = '';
  }

  formatCurrency(amount: number): string {
    return `EGP ${amount.toFixed(2)}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 