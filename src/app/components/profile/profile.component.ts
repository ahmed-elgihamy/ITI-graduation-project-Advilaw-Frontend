import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { LawyerProfile } from '../models/LawyerProfile';
import { Review } from '../models/Review';
import { LawyerSchedule } from '../models/Lawyer Schedule';
import { LawyerService } from '../../services/lawyer.service';
import { Subject, forkJoin, throwError } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  lawyer: LawyerProfile | null = null;
  reviews: Review[] = [];
  schedule: LawyerSchedule[] = [];
  isLoading = true;
  errorMessage = '';

  readonly STAR_LEVELS = [5, 4, 3, 2, 1];

  private chart: Chart | null = null;
  private destroy$ = new Subject<void>();

  @ViewChild('reviewChart', { static: false })
  reviewChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private route: ActivatedRoute,
    private lawyerService: LawyerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLawyerData();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chart?.destroy();
  }

  get avatarUrl(): string {
    return this.lawyer?.photoUrl || 'assets/default-avatar.png';
  }

  private loadLawyerData(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.handleError('Invalid lawyer ID provided.');
      return;
    }

    this.isLoading = true;
    forkJoin({
      profile: this.lawyerService.getProfile(id),
      reviews: this.lawyerService.getReviews(id),
      schedule: this.lawyerService.getSchedule(id),
    })
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.handleError('Failed to load lawyer information.');
          return throwError(() => err);
        })
      )
      .subscribe(({ profile, reviews, schedule }) => {
        this.lawyer = profile;
        this.reviews = reviews;
        this.schedule = schedule;
        this.isLoading = false;
        this.cdr.markForCheck();
        this.renderChart();
      });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  private renderChart(): void {
    if (!this.reviewChartRef) {
      return;
    }
    const ctx = this.reviewChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }
    this.chart?.destroy();

    const stats = this.calculateReviewStats();

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.STAR_LEVELS.map((s) => `${s}★`),
        datasets: [
          {
            label: 'Count',
            data: stats,
            backgroundColor: 'rgba(240, 179, 90, 0.8)',
            borderColor: '#313f4c',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#313f4c',
            titleColor: '#f9f1e3',
            bodyColor: '#f9f1e3',
            borderColor: '#f0b35a',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: { color: '#313f4c', font: { weight: 'bold', size: 14 } },
            grid: { display: false },
            border: { color: '#313f4c' },
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: '#313f4c', font: { size: 12 } },
            grid: { color: 'rgba(49, 63, 76, 0.1)' },
            border: { color: '#313f4c' },
          },
        },
      },
    });
  }

  private calculateReviewStats(): number[] {
    const counts = this.STAR_LEVELS.map(() => 0);
    this.reviews.forEach((r) => {
      const idx = this.STAR_LEVELS.indexOf(r.rate);
      if (idx !== -1) {
        counts[idx]++;
      }
    });
    return counts;
  }

  getRatingPercent(stars: number): number {
    const total = this.reviews.length;
    if (!total) {
      return 0;
    }
    const count = this.reviews.filter((r) => r.rate === stars).length;
    return Math.round((count / total) * 100);
  }

  getStarArray(rating: number): any[] {
    return Array(rating);
  }

  trackByReviewId(_: number, item: Review): number {
    return item.id;
  }

  trackByScheduleDay(_: number, item: LawyerSchedule): string {
    return item.day;
  }

  onFollowClick(): void {
    console.log('Follow clicked');
  }

  onConsultationClick(): void {
    console.log('Consultation requested');
  }
}
