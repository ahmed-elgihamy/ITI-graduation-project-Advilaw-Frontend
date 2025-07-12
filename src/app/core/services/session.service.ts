import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { env } from '../env/env';
import { Observable } from 'rxjs';
import { SessionDetails } from '../models/session-details';
import { Message } from '../../components/models/message';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private durationSeconds = signal(0);
  private remainingSeconds = signal(0);
  private intervalId: any = null;
  sesstionId: number = 0;
  route = inject(Router)
  sessionEnded = computed(() => this.remainingSeconds() <= 0);


  timeLeft = computed(() => this.remainingSeconds());

  private alerted = false;
  showFinalWarning = signal(false);
  _http = inject(HttpClient);

  getSessionDetails(sessionId: number): Observable<any> {
    this.sesstionId = sessionId;
    return this._http.get<any>(`${env.baseUrl}/session/${sessionId}`);
  }

  markSessionAsCompleted(sessionId: number): Observable<any> {
    console.log("📌 Marking session as completed:", sessionId);
    return this._http.post(`${env.baseUrl}/session/${sessionId}/complete`, { sessionId });
  }

  // startSession(minutes: number): void {

  //   const totalSeconds = minutes * 60;
  //   this.remainingSeconds.set(totalSeconds);
  //   this.showFinalWarning.set(false);
  //   this.alerted = false;

  //   if (this.intervalId) clearInterval(this.intervalId);

  //   this.intervalId = setInterval(() => {
  //     const current = this.remainingSeconds();

  //     if (current > 0) {
  //       this.remainingSeconds.set(current - 1);

  //       // Trigger warning at 5 minutes left
  //       if (current === 300 && !this.alerted) {
  //         this.showFinalWarning.set(true);
  //         this.alerted = true;
  //       }
  //     } else {
  //       clearInterval(this.intervalId);

  //       this.playEndSound()
  //       setTimeout(() => {
  //         this.route.navigate(['/ConsultationReview']);
  //       }, 9000);

  //     }
  //   }, 1000);
  // }

  startSession(durationMinutes: number, appointmentTime: string | Date): void {
    const start = new Date(appointmentTime).getTime();
    const end = start + durationMinutes * 60 * 1000;

    if (this.intervalId) clearInterval(this.intervalId);

    this.alerted = false;
    this.showFinalWarning.set(false);

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor((end - now) / 1000);

      if (remaining <= 0) {
        this.remainingSeconds.set(0);
        clearInterval(this.intervalId);
        this.playEndSound();
        this.markSessionAsCompleted(this.sesstionId).subscribe({
          next: () => console.log("✅ Session marked as completed."),
          error: (err) => console.error("❌ Failed to mark session as completed:", err)
        });

        setTimeout(() => {
          this.route.navigate([`/ConsultationReview/${this.sesstionId}`]);
        }, 9000);
      } else {
        this.remainingSeconds.set(remaining);

        if (remaining <= 300 && !this.alerted) {
          this.showFinalWarning.set(true);
          this.alerted = true;
        }
      }
    }, 1000);
  }


  playEndSound() {
    const audio = new Audio('/assets/sounds/soundend.mp3');
    audio.play().catch(err => {
      console.warn('🔇 Audio playback failed:', err);
    });
  }
  unlockAudio() {
    const audio = new Audio();
    audio.play().catch(() => { });
  }


  stopSession(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.remainingSeconds.set(0);
  }

  getRemainingSeconds(): number {
    return this.remainingSeconds();
  }

  getRemainingTime(): string {
    const seconds = this.remainingSeconds();
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }




}
