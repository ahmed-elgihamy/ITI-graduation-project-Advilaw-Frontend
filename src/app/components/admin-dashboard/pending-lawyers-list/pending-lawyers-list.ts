import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pending-lawyers-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './pending-lawyers-list.html',
  styleUrls: ['./pending-lawyers-list.css']
})
export class PendingLawyersList implements OnInit {
  pendingLawyers: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadPendingLawyers();
  }

  loadPendingLawyers() {
    this.adminService.getPendingLawyers().subscribe(data => {
      this.pendingLawyers = data;
    });
  }

  approveLawyer(id: number) {
    this.adminService.approveLawyer(id.toString()).subscribe(() => {
      this.pendingLawyers = this.pendingLawyers.filter(lawyer => lawyer.id !== id);
    });
  }
}