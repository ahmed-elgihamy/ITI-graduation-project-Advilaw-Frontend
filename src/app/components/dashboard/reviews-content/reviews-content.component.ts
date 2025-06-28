import { Component } from '@angular/core';
import { ReviewsService } from '../../../core/services/reviews.service';
import { PagedResponse } from '../../../types/PagedResponse';
import { ApiResponse } from '../../../types/ApiResponse';
import { LawyerReviewListDTO } from '../../../types/Lawyers/LawyerReviewListDTO';
import { DashboardTableComponent } from '../dashboard-table/dashboard-table.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-reviews-content',
  imports: [DashboardTableComponent, PaginationComponent],
  templateUrl: './reviews-content.component.html',
  styleUrl: './reviews-content.component.css',
})
export class ReviewsContentComponent {
  ApiService: any;
  constructor(private ReviewsService: ReviewsService) {
    this.ApiService = ReviewsService;
  }

  ngOnInit(): void {
    this.loadData(1);
  }

  reviewColumns = [
    {
      key: 'otherPersonImgUrl',
      label: 'Image',
      type: 'image',
    },
    { key: 'otherPersonId', label: 'ID' },
    { key: 'otherPersonName', label: 'Sender' },
    { key: 'text', label: 'Message' },
    { key: 'rate', label: 'Rate' },
    { key: 'type', label: 'Review Type' },
    { key: 'createdAt', label: 'Date' },
  ];

  reviews: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  loadData(page: number): void {
    this.currentPage = page;

    this.ApiService.GetLawyerReviews(page).subscribe({
      next: (res: ApiResponse<PagedResponse<LawyerReviewListDTO>>) => {
        const pagedData = res.data;
        this.reviews = pagedData.data; // actual job list
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
