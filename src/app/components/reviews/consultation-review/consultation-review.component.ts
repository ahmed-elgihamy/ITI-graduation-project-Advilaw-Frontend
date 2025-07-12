import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import confetti from 'canvas-confetti';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { SessionService } from '../../../core/services/session.service';
import { ReviewDto } from '../../../core/models/review-dto';

@Component({
  selector: 'app-consultation-review',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RatingModule],
  templateUrl: './consultation-review.component.html',
  styleUrls: ['./consultation-review.component.css'],
})
export class ConsultationReviewComponent implements OnInit {
  selectedRating = 0;
  previousRating: number | null = null;
  totalRatings = 0;
  ratingCounts = [0, 0, 0, 0, 0];
  commentControl = new FormControl('');
  sessionId: number = 0;
  sessionDetails: any;
  UserInfo: any;
  ErrorText: string = '';
  // Services
  router = inject(Router);
  route = inject(ActivatedRoute);
  auth = inject(AuthService);
  sessionService = inject(SessionService);
  reviewService = inject(ReviewsService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.sessionId = +id;

        this.sessionService.getSessionDetails(this.sessionId).subscribe({
          next: (details) => {
            this.sessionDetails = details;
            console.log('Session Details:', this.sessionDetails);
          },
          error: (err) => {
            console.error("🔴 Failed to load session details:", err);
          }
        });

        this.UserInfo = this.auth.getUserInfo();
        console.log('User Info:', this.UserInfo);
      }
    });
  }



  submitReview() {
    if (this.selectedRating === 0) {
      console.warn('Please select a rating before submitting.');
      return;
    }

    const reviewerId = this.UserInfo?.userId;
    const revieweeId = this.getRevieweeId();

    const review: ReviewDto = {
      sessionId: this.sessionId,
      reviewerId,
      revieweeId,
      rate: this.selectedRating,
      text: this.commentControl.value ?? '',
      type: this.UserInfo.role === 'Client' ? 0 : 1
    };

    console.log(review)

    this.reviewService.submitReview(review).subscribe({
      next: () => {
        console.log('✅ Review submitted to backend');
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => this.router.navigate(['/home']), 5000);
      },
      error: (err) => {

        this.ErrorText = err.error?.message || 'An error occurred while submitting the review.';
        console.error('❌ Failed to submit review:', err);
      }
    });
  }
  getRevieweeId(): string {
    if (!this.UserInfo || !this.sessionDetails) return '';
    const isClient = this.UserInfo.role === 'Client';
    console.log('Session Details:', this.sessionDetails);
    return isClient ? this.sessionDetails.lawyerId : this.sessionDetails.clientId;
  }

  // Optional display helpers
  get percentages(): number[] {
    return this.ratingCounts.map(c => (this.totalRatings > 0 ? (c / this.totalRatings) * 100 : 0));
  }

  get averageRating(): number {
    const sum = this.ratingCounts.reduce((acc, c, i) => acc + c * (i + 1), 0);
    return this.totalRatings ? sum / this.totalRatings : 0;
  }

  get ratingGiven() {
    return this.selectedRating > 0;
  }

  onRateChange(): void {
    const newRating = this.selectedRating;

    if (newRating < 1 || newRating > 5) return;
    if (this.previousRating === newRating) return;

    if (this.previousRating === null) {
      this.ratingCounts[newRating - 1]++;
      this.totalRatings++;
    } else {
      this.ratingCounts[this.previousRating - 1] = Math.max(0, this.ratingCounts[this.previousRating - 1] - 1);
      this.ratingCounts[newRating - 1]++;
    }

    this.previousRating = newRating;

  }
}
