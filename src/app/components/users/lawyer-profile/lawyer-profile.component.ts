import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LawyerProfile } from '../../models/LawyerProfile';
import { Review } from '../../models/Review';
import { LawyerSchedule } from '../../models/Lawyer Schedule';
import { LawyerService } from '../../../core/services/lawyer.service';
import { Subject, forkJoin, throwError } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-lawyer-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './lawyer-profile.component.html',
  styleUrl: './lawyer-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LawyerProfileComponent implements OnInit, OnDestroy {
  lawyer: LawyerProfile | null = null;
  reviews: Review[] = [];
  schedule: LawyerSchedule[] = [];
  isLoading = true;
  errorMessage = '';
  isLawyer = false;
  isClient = false;

  readonly STAR_LEVELS = [5, 4, 3, 2, 1];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private lawyerService: LawyerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLawyerData();
    console.log('User role:', this.authService.getUserInfo()?.role);
    this.isLawyer = this.authService.getUserInfo()?.role === 'Lawyer';
    this.isClient = this.authService.getUserInfo()?.role === 'Client';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get avatarUrl(): string {
    return this.lawyer?.photoUrl || 'assets/images/default-profile.png';
  }

  private loadLawyerData(): void {
    const id = this.route.snapshot.paramMap.get('id');
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
      });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  getRatingPercent(stars: number): number {
    const total = this.reviews.length;
    if (!total) return 0;
    const count = this.reviews.filter((r) => r.rate === stars).length;
    return Math.round((count / total) * 100);
  }

  getStarArray(rating: number): any[] {
    return Array(rating).fill(0);
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
    if (!this.lawyer) return;
    this.router.navigate(['/client/consultation', this.lawyer.id]);
  }
}
