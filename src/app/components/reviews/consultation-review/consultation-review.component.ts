import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { MessageService } from 'primeng/api';
import confetti from 'canvas-confetti';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-consultation-review',
  imports: [FormsModule, CommonModule, RatingModule, ReactiveFormsModule],
  styleUrls: ['./consultation-review.component.css'],
  templateUrl: './consultation-review.component.html',
})
export class ConsultationReviewComponent {
  selectedRating = 0;
  previousRating: number | null = null;
  totalRatings = 0;
  ratingCounts = [0, 0, 0, 0, 0];
  commentControl = new FormControl('');
  router = inject(Router);
  // MessageService = inject(MessageService);
  // constructor(private MessageService: MessageService) { }
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

    if (newRating < 1 || newRating > 5) {
      console.warn('Invalid rating value. Must be between 1 and 5.');
      return;
    }

    if (this.previousRating === newRating) {
      return;
    }

    if (this.previousRating === null) {
      this.ratingCounts[newRating - 1]++;
      this.totalRatings++;
    }
    else {
      // Remove the old rating
      this.ratingCounts[this.previousRating - 1] = Math.max(0, this.ratingCounts[this.previousRating - 1] - 1);
      // Add the new rating
      this.ratingCounts[newRating - 1]++;
      // Total stays the same when changing rating
    }

    this.previousRating = newRating;

    console.log('Updated Rating Counts:', this.ratingCounts);
    console.log('Updated Total Ratings:', this.totalRatings);
  }

  submitReview() {
    if (this.selectedRating === 0) {
      console.warn('Please select a rating before submitting.');
      return;
    }



    const review = {
      rating: this.selectedRating,
      comment: this.commentControl.value
    };
    console.log('Review Submitted:', review);

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });



    setTimeout(() => this.router.navigate(['/home']), 3000);
  }
}