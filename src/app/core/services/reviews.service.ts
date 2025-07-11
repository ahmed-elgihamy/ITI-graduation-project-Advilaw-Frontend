import { Injectable } from '@angular/core';
import { env } from '../env/env';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LawyerReviewListDTO } from '../../types/Lawyers/LawyerReviewListDTO';
import { PagedResponse } from '../../types/PagedResponse';
import { ApiResponse } from '../../types/ApiResponse';
import { Observable } from 'rxjs';
import { ReviewDto } from '../models/review-dto';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  Role: string | null = null;
  apiUrl = env.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.Role = authService.getUserInfo()?.role ?? null;
  }

  GetLawyerReviews(
    page: number
  ): Observable<ApiResponse<PagedResponse<LawyerReviewListDTO>>> {
    return this.http.get<ApiResponse<PagedResponse<LawyerReviewListDTO>>>(
      `${this.apiUrl}/lawyer/me/payments?pageNumber=${page}`
    );
  }




  submitReview(review: ReviewDto): Observable<any> {
    if (!review.sessionId || !review.reviewerId || !review.revieweeId || review.rate === 0) {
      console.error('❌ Invalid review data:', review);
    }
    console.log('Submitting review:', review);
    return this.http.post(`${env.baseUrl}/reviews`, review);
  }

}
