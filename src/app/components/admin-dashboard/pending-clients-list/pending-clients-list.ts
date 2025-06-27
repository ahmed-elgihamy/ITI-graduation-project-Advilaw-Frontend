import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pending-clients-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './pending-clients-list.html',
  styleUrl: './pending-clients-list.css'
})
export class PendingClientsList implements OnInit {
  pendingClients: any[] = [];
  selectedClient: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadPendingClients();
  }

  loadPendingClients() {
    this.adminService.getPendingClients().subscribe(data => {
      this.pendingClients = data;
    });
  }

  approveClient(id: number) {
    this.adminService.approveClient(id).subscribe(() => {
      this.pendingClients = this.pendingClients.filter(client => client.id !== id);
    });
  }

  showClientDetails(client: any) {
    this.selectedClient = client;
  }
}
