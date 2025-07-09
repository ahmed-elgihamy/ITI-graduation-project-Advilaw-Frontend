import { Component } from '@angular/core';
import { DashboardTableComponent } from '../../components/dashboard/dashboard-table/dashboard-table.component';
import { PaginationComponent } from '../../components/dashboard/pagination/pagination.component';
import { ApiResponse } from '../../types/ApiResponse';
import { PagedResponse } from '../../types/PagedResponse';
import { LawyersService } from '../../core/services/lawyer/lawyers.service';
import { LawyerListDTO } from '../../types/Lawyers/LawyerListDTO';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lawyers',
  imports: [DashboardTableComponent, PaginationComponent, RouterLink],
  templateUrl: './lawyers.component.html',
  styleUrl: './lawyers.component.css',
})
export class LawyersComponent {
  ApiService: any;
  constructor(private lawyersService: LawyersService) {
    this.ApiService = lawyersService;
  }
  ngOnInit(): void {
    this.loadData(1);
  }

  lawyersColumns = [
    {
      key: 'imageUrl',
      label: 'Profile Image',
      type: 'image',
    },
    { key: 'userName', label: 'Name' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'gender', label: 'Gender', type: 'enum', enumType: 'Gender' },
  ];

  lawyers: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  loadData(page: number): void {
    this.currentPage = page;
    this.ApiService.GetLawyers(page).subscribe({
      next: (res: ApiResponse<PagedResponse<LawyerListDTO>>) => {
        // change LawyerId to UserId
        const pagedData = res.data;
        this.lawyers = pagedData.data; // actual lawyer list
        this.lawyers.map((lawyer) => (lawyer.id = lawyer.userId));
        this.totalPages = pagedData.totalPages;
        this.pageSize = pagedData.pageSize;
        this.currentPage = pagedData.pageNumber;

        console.log(res);
      },
      error: (err: any) => {
        console.error('Failed to load lawyers:', err);
      },
    });
  }
}
