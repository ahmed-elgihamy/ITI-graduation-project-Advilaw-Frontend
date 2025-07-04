import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
  client: any;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    console.log('Client ID from route:', id);
  
    if (id) {
      this.adminService.getClientById(id).subscribe({
        next: (data) => {
          this.client = data;
        },
        error: (err) => {
          console.error('Error loading client:', err);
        }
      });
    }
  }
  

  approveClient() {
    this.adminService.approveClient(this.client.id).subscribe(() => {
      this.router.navigate(['/dashboard/admin-dashboard/pending-clients']);
    });
  }

  backToList() {
    this.router.navigate(['/dashboard/admin-dashboard/pending-clients']);
  }
} 