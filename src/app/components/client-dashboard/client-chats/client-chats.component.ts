import { AuthService } from './../../../core/services/auth.service';
import { SessionService } from './../../../core/services/session.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientJobChatDto, ClientService } from '../../../core/services/client.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { ChatDTO, ChatStatus } from '../../../types/Chat/ChatDTO';
import { PagedResponse } from '../../../types/PagedResponse';
import { ApiResponse } from '../../../types/ApiResponse';

@Component({
  selector: 'app-client-chats',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-chats.component.html',
  styleUrl: './client-chats.component.css'
})
export class ClientChatsComponent implements OnInit {
  chats: ClientJobChatDto[] = [];
  filteredChats: ClientJobChatDto[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalItems = 0;
  isLoading = false;
  error = '';

  // Filter properties
  selectedStatus: string = 'all';
  searchTerm: string = '';

  // Statistics
  statistics = {
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  };

  // Available filters
  statusOptions = [
    { value: 'all', label: 'All Chats' },
    { value: ChatStatus.Active, label: 'Active' },
    { value: ChatStatus.Completed, label: 'Completed' },
    { value: ChatStatus.Pending, label: 'Pending' }
  ];

  // Expose ChatStatus enum and Math to template
  ChatStatus = ChatStatus;
  Math = Math;
  constructor(
    private clientService: ClientService,
    private mockDataService: MockDataService,
    private AuthService: AuthService

  ) { }

  _session = inject(SessionService)
  ngOnInit(): void {
    this.loadChats();

  }

  loadChats(): void {
    this.isLoading = true;
    this.error = '';
    const clientId = this.AuthService.getUserInfo()?.userId;

    this.clientService.getClientJobChats(clientId!).subscribe({
      next: (res) => {
        console.log(res);
        this.filteredChats = res; // Assuming you want to assign the entire array
        this.updateStatistics();
        this.isLoading = false;

      },
      error: (err) => {

        console.error('Failed to load chatsdddddddddd:', err);
        this.error = 'Failed to load chats. Please try again.';
        this.isLoading = false;
      }
    });

  }

  updateStatistics(): void {
    this.statistics.total = this.chats.length;
    this.statistics.active = this.chats.filter(chat => chat.status === ChatStatus.Active).length;
    this.statistics.completed = this.chats.filter(chat => chat.status === ChatStatus.Completed).length;
    this.statistics.pending = this.chats.filter(chat => chat.status === ChatStatus.Pending).length;
  }

  applyFilters(): void {
    this.filteredChats = this.chats.filter(chat => {
      const matchesStatus = this.selectedStatus === 'all' || chat.status === this.selectedStatus;
      const matchesSearch = !this.searchTerm ||
        chat.lawyerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        chat.jobTitle.toLowerCase().includes(this.searchTerm.toLowerCase())

      return matchesStatus && matchesSearch;
    });
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadChats();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'badge bg-success';
      case 'Completed':
        return 'badge bg-secondary';
      case 'Pending':
        return 'badge bg-warning text-dark';
      case 'Started':
        return 'badge bg-info';
      default:
        return 'badge bg-light text-dark';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case ChatStatus.Active:
        return 'Active';
      case ChatStatus.Completed:
        return 'Completed';
      case ChatStatus.Pending:
        return 'Pending';
      default:
        return status;
    }
  }

  formatLastMessageTime(timeString: string): string {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }

  getUnreadBadgeClass(unreadCount: number): string {
    if (unreadCount === 0) {
      return 'badge bg-light text-muted';
    } else if (unreadCount > 10) {
      return 'badge bg-danger';
    } else {
      return 'badge bg-primary';
    }
  }
}
