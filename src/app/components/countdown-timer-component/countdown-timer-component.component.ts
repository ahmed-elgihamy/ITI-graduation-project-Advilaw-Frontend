import { Router, ActivatedRoute } from '@angular/router';
import { Component, computed, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { interval, takeWhile } from 'rxjs';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-countdown-timer-component',
  imports: [],
  templateUrl: './countdown-timer-component.component.html',
  styleUrl: './countdown-timer-component.component.css'
})
export class CountdownTimerComponentComponent implements OnInit, OnDestroy {
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  totalMinutes: number = 0;

  waitingMessage: string = 'Please wait until the session begins';
  sessionDate: string = '';
  isSessionReady: boolean = false;
  isBlinking: boolean = false;
  sessionId: number | null = null;

  _route = inject(Router)
  _activatedRoute = inject(ActivatedRoute)
  sessionService = inject(SessionService)

  // Progress ring properties
  circumference: number = 2 * Math.PI * 90;
  strokeDashoffset: number = 0;

  private intervalId: any;
  private blinkIntervalId: any;
  private targetTime: Date = new Date();

  ngOnInit() {
    
    this._activatedRoute.queryParams.subscribe(params => {
      this.sessionId = params['sessionId'] ? parseInt(params['sessionId']) : null;
      console.log('Countdown component received session ID:', this.sessionId);
    });

    this.initializeTimer();
    this.startTimer();
    this.startBlinking();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.blinkIntervalId) {
      clearInterval(this.blinkIntervalId);
    }
  }

  private initializeTimer() {
    // Set target time to 30 minutes from now (you can adjust this)
    this.targetTime = new Date(Date.now() + 0.20 * 60 * 1000);
    this.sessionDate = this.targetTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private startTimer() {
    this.intervalId = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  private startBlinking() {
    this.blinkIntervalId = setInterval(() => {
      this.isBlinking = !this.isBlinking;
    }, 1500);
  }

  private updateTimer() {
    const now = new Date().getTime();
    const targetTime = this.targetTime.getTime();
    const timeDifference = targetTime - now;

    if (timeDifference > 0) {
      this.hours = Math.floor(timeDifference / (1000 * 60 * 60));
      this.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      this.totalMinutes = Math.floor(timeDifference / (1000 * 60));

      // Update progress ring
      const totalSeconds = this.hours * 3600 + this.minutes * 60 + this.seconds;
      const initialSeconds = 30 * 60; // 30 minutes
      const progress = (initialSeconds - totalSeconds) / initialSeconds;
      this.strokeDashoffset = this.circumference * (1 - progress);

      this.updateWaitingMessage();
    } else {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.totalMinutes = 0;
      this.isSessionReady = true;
      this.waitingMessage = 'Session is ready now! You can enter';
      this.strokeDashoffset = 0;
      
      // Navigate to chat with session ID if available
      if (this.sessionId) {
        this._route.navigate(['/chat'], { 
          queryParams: { sessionId: this.sessionId } 
        });
        this.sessionService.startSession(this.sessionId);
      } else {
        this._route.navigate(['/chat']);
        this.sessionService.startSession(1);
      }

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
  }

  private updateWaitingMessage() {
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

  formatTime(time: number): string {
    return time.toString().padStart(2, '0');
  }
}
