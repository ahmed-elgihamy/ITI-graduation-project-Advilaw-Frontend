import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule, NgStyle } from '@angular/common';


@Component({
  selector: 'app-admins-list',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './admins-list.html',
  styleUrl: './admins-list.css'
})
export class AdminsList implements OnInit {
  admins: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.isLoading = true;
    this.adminService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load admins.';
        this.isLoading = false;
      }
    });
  }

  onRoleChange(admin: any, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value;
    if (admin.role === newRole) return;
    this.adminService.assignRoleToAdmin(admin.userId, newRole).subscribe({
      next: () => {
        admin.role = newRole;
      },
      error: (err) => {
        console.error('Assign role error:', err);
        this.error = 'Failed to assign role.';
      }
    });
  }
}
