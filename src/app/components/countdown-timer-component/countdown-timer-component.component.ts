import { AppointmentDetailsDTO } from './../../types/Appointments/AppointmentDetailsDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, computed, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { interval, takeWhile, catchError, of } from 'rxjs';
import { SessionService } from '../../core/services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown-timer-component',
  imports: [CommonModule],
  templateUrl: './countdown-timer-component.component.html',
  styleUrl: './countdown-timer-component.component.css'
})
export class CountdownTimerComponentComponent implements OnInit, OnDestroy {
  // Timer display properties
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  totalMinutes: number = 0;

  // UI state properties
  waitingMessage: string = 'Please wait until the session begins';
  sessionDate: string = '';
  isSessionReady: boolean = false;
  isBlinking: boolean = false;
  isLoading: boolean = true;
  error: string = '';

  // Services
  private _route = inject(Router);
  private sessionService = inject(SessionService);
  private route = inject(ActivatedRoute);

  // Progress ring properties
  circumference: number = 2 * Math.PI * 90;
  strokeDashoffset: number = 0;

  // Private properties
  private intervalId: any;
  private blinkIntervalId: any;
  private targetTime: Date = new Date();
  sessionId: number = 4;
  appointmentTime: any;
  sessionDetails: any;

  ngOnInit(): void {
    this.initializeSession();
  }

  ngOnDestroy(): void {
    this.cleanupTimers();
  }

  /**
   * Initialize session by getting session ID from route parameters
   */
  private initializeSession(): void {
    this.route.paramMap.subscribe(params => {
      const sessionIdParam = params.get('sessionId');
      if (sessionIdParam) {
        this.sessionId = +sessionIdParam;
        this.loadSessionDetails();
      } else {
        this.handleError('No session ID provided');
      }
    });
  }

  /**
   * Load session details from the service
   */
  private loadSessionDetails(): void {
    this.isLoading = true;
    this.error = '';

    this.sessionService.getSessionDetails(this.sessionId)
      .pipe(
        catchError(error => {
          console.error('Error loading session details:', error);
          this.handleError('Failed to load session details. Please try again.');
          return of(null);
        })
      )
      .subscribe({
        next: (details) => {
          if (details) {
            this.handleSessionDetails(details);
          }
        }
      });
  }

  /**
   * Handle session details and initialize timer
   */
  private handleSessionDetails(details: any): void {
    this.sessionDetails = details;
    this.appointmentTime = details.appointmentTime;

    if (!this.appointmentTime) {
      this.handleError('Invalid appointment time');
      return;
    }

    this.initializeTimer(this.appointmentTime);
    this.checkSessionTiming();
  }

  /**
   * Check if session should start immediately or wait
   */
  private checkSessionTiming(): void {
    const now = Date.now();
    const start = new Date(this.appointmentTime).getTime();
    const delayUntilStart = start - now;

    if (delayUntilStart > 0) {
      this.startTimer();
      this.startBlinking();
    } else {
      this.navigateToChat();
    }

    this.isLoading = false;
  }

  /**
   * Initialize timer with appointment time
   */
  private initializeTimer(startTimeStr: string): void {
    this.targetTime = new Date(startTimeStr);

    this.sessionDate = this.targetTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Start the countdown timer
   */
  private startTimer(): void {
    this.intervalId = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  /**
   * Start blinking animation
   */
  private startBlinking(): void {
    this.blinkIntervalId = setInterval(() => {
      this.isBlinking = !this.isBlinking;
    }, 1500);
  }

  /**
   * Update timer display and check if session should start
   */
  private updateTimer(): void {
    const now = new Date().getTime();
    const targetTime = this.targetTime.getTime();
    const timeDifference = targetTime - now;

    if (timeDifference > 0) {
      this.updateTimerDisplay(timeDifference);
      this.updateProgressRing(timeDifference);
      this.updateWaitingMessage();
    } else {
      this.handleSessionReady();
    }
  }

  /**
   * Update timer display values
   */
  private updateTimerDisplay(timeDifference: number): void {
    this.hours = Math.floor(timeDifference / (1000 * 60 * 60));
    this.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    this.totalMinutes = Math.floor(timeDifference / (1000 * 60));
  }

  /**
   * Update progress ring animation
   */
  private updateProgressRing(timeDifference: number): void {
    const totalSeconds = Math.floor(timeDifference / 1000);
    const initialSeconds = 30 * 60; // 30 minutes
    const progress = Math.max(0, (initialSeconds - totalSeconds) / initialSeconds);
    this.strokeDashoffset = this.circumference * (1 - progress);
  }

  /**
   * Handle session ready state
   */
  private handleSessionReady(): void {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.totalMinutes = 0;
    this.isSessionReady = true;
    this.waitingMessage = 'Session is ready now! You can enter';
    this.strokeDashoffset = 0;

    this.cleanupTimers();
    this.navigateToChat();
  }

  /**
   * Navigate to chat component
   */
  private navigateToChat(): void {
    if (this.sessionDetails?.durationHours && this.appointmentTime) {
      this.sessionService.startSession(this.sessionDetails.durationHours, this.appointmentTime);
    }
    this._route.navigate([`/chat/${this.sessionId}`]);
  }

  /**
   * Update waiting message based on time remaining
   */
  private updateWaitingMessage(): void {
    const messages = [
      'Please wait until the session begins',
      'We are preparing everything for your upcoming session',
      'You will be notified when the session starts',
      'Thank you for your patience, the session will begin soon'
    ];

    if (this.totalMinutes > 20) {
      this.waitingMessage = messages[0];
    } else if (this.totalMinutes > 10) {
      this.waitingMessage = messages[1];
    } else if (this.totalMinutes > 5) {
      this.waitingMessage = messages[2];
    } else {
      this.waitingMessage = messages[3];
    }
  }

  /**
   * Handle errors gracefully
   */
  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
    this.cleanupTimers();
  }

  /**
   * Clean up timer intervals
   */
  private cleanupTimers(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.blinkIntervalId) {
      clearInterval(this.blinkIntervalId);
      this.blinkIntervalId = null;
    }
  }

  /**
   * Format time for display
   */
  formatTime(time: number): string {
    return time.toString().padStart(2, '0');
  }

  /**
   * Retry loading session details
   */
  retry(): void {
    this.loadSessionDetails();
  }

  /**
   * Navigate back to dashboard
   */
  goToDashboard(): void {
    this._route.navigate(['/client/overview']);
  }
}