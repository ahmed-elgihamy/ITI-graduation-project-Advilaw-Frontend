import { JobsService } from './../../../core/services/jobs.service';
import { Component, OnInit } from '@angular/core';
import { DashboardTableComponent } from '../dashboard-table/dashboard-table.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ApiResponse } from '../../../types/ApiResponse';
import { PagedResponse } from '../../../types/PagedResponse';

@Component({
  selector: 'app-jobs-content',
  imports: [DashboardTableComponent, PaginationComponent],
  templateUrl: './jobs-content.component.html',
  styleUrl: './jobs-content.component.css',
})
export class JobsContentComponent implements OnInit {
  ApiService: any;
  constructor(private jobsService: JobsService) {
    this.ApiService = jobsService;
  }
  ngOnInit(): void {
    this.loadData(1);
  }
  // jobData = [
  //   {
  //     client: 'Client Name 1',
  //     jobTitle: 'Sample Job Title 1',
  //     description: 'Sample job description goes here.',
  //     budget: '$1000',
  //     field: 'Legal',
  //     image: 'https://placehold.co/40x40',
  //   },
  //   // more jobs...
  // ];

  jobColumns = [
    { key: 'client', label: 'Client' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'description', label: 'Description' },
    { key: 'budget', label: 'Budget' },
    { key: 'field', label: 'Field' },
  ];

  jobs: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  loadData(page: number): void {
    this.currentPage = page;

    this.jobsService.GetJobs(page).subscribe({
      next: (res: ApiResponse<PagedResponse<any>>) => {
        const pagedData = res.data;
        this.jobs = pagedData.data; // actual job list
        this.totalPages = pagedData.totalPages;
        this.pageSize = pagedData.pageSize;
        this.currentPage = pagedData.pageNumber;
        console.log(res);
      },
      error: (err) => {
        console.error('Failed to load jobs:', err);
      },
    });
  }
}
