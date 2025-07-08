import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-overview',
  imports: [CommonModule, RouterModule],
  templateUrl: './client-overview.component.html',
  styleUrl: './client-overview.component.css'
})
export class ClientOverviewComponent implements OnInit {
  statistics = {
    jobsCount: 0,
    chatsCount: 0,
    paymentsCount: 0,
    consultationsCount: 0
  };

  isLoading = true;
  error = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadStatistics();
  

  }

  loadStatistics(): void {
    this.isLoading = true;
    this.error = '';

     this.clientService.getClientJobs().subscribe({
       next: (response) => {
          let count=response.data.data.length
          this.statistics.jobsCount = count;
          this.isLoading = false;
       },
       error: (error) => {
         console.error('Error loading statistics:', error);
         this.error = 'Failed to load statistics';
         this.isLoading = false;
       }
    });
  }

  
}
