import { Component, OnInit } from '@angular/core';
import { JobsService } from '../../../core/services/jobs.service';
import { ApiResponse } from '../../../types/ApiResponse';
import { PagedResponse } from '../../../types/PagedResponse';
import { JobListDTO } from '../../../types/Jobs/JobListDTO';
import { DashboardTableComponent } from '../../../components/dashboard/dashboard-table/dashboard-table.component';
import { PaginationComponent } from '../../../components/dashboard/pagination/pagination.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jobs',
  imports: [DashboardTableComponent, PaginationComponent, CommonModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
})
export class JobsComponent implements OnInit {
  ApiService: any;
  IsClient: boolean = false;
  IsLawyer: boolean = false;
  constructor(
    private jobsService: JobsService,
    private router: Router,
    private authService: AuthService
  ) {
    this.ApiService = jobsService;
  }
  ngOnInit(): void {
    const user = this.authService.getUserInfo(); // decode JWT or from localStorage
    if (user?.role === 'Lawyer') {
      this.IsLawyer = true;
      // Add Lawyer-specific columns
      this.jobsColumns.push(
        // { key: 'clientId', label: 'Client ID' },
        { key: 'clientName', label: 'Client Name' }
      );
      // this.router.navigate(['/dashboard/jobs']);
    }
    if (user?.role === 'Client') {
      this.IsClient = true;
    }
    this.loadData(1);
  }

  jobsColumns = [
    {
      key: 'clientImageUrl',
      label: 'Image',
      type: 'image',
    },
    // {
    //   key: 'id',
    //   label: 'Job ID',
    //   type: 'link',
    //   link: '/jobs/', // base path
    //   linkKey: 'id', // value from the row to append
    // },
    { key: 'header', label: 'Header' },
    { key: 'description', label: 'Description' },
    { key: 'budget', label: 'Budget' },
    // { key: 'isAnonymus', label: 'Anonymous', type: 'boolean' },

    // { key: 'jobFieldId', label: 'Job Field ID' },
    { key: 'jobFieldName', label: 'Job Field Name' },
    { key: 'status', label: 'Status', type: 'enum', enumType: 'JobStatus' },
  ];

  jobs: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  loadData(page: number): void {
    this.currentPage = page;
    this.ApiService.GetJobs(page).subscribe({
      next: (res: ApiResponse<PagedResponse<JobListDTO>>) => {
        const pagedData = res.data;
        this.jobs = pagedData.data; // actual job list
        this.totalPages = pagedData.totalPages;
        this.pageSize = pagedData.pageSize;
        this.currentPage = pagedData.pageNumber;
        console.log(res);
      },
      error: (err: any) => {
        console.error('Failed to load jobs:', err);
      },
    });
  }
}
