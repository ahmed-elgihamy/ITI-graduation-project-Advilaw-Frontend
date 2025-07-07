import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private durationSeconds = signal(0);
  private remainingSeconds = signal(0);
  private intervalId: any = null;

  route = inject(Router)
  sessionEnded = computed(() => this.remainingSeconds() <= 0);


  timeLeft = computed(() => this.remainingSeconds());

  private alerted = false;
  showFinalWarning = signal(false);

  startSession(minutes: number): void {

    const totalSeconds = minutes * 60;
    this.remainingSeconds.set(totalSeconds);
    this.showFinalWarning.set(false);
    this.alerted = false;

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      const current = this.remainingSeconds();

      if (current > 0) {
        this.remainingSeconds.set(current - 1);

        // Trigger warning at 5 minutes left
        if (current === 300 && !this.alerted) {
          this.showFinalWarning.set(true);
          this.alerted = true;
        }
      } else {
        clearInterval(this.intervalId);

        this.playEndSound()
        setTimeout(() => {
          this.route.navigate(['/ConsultationReview']);
        }, 9000);

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
    audio.play().catch(() => { }); // محاولة وهمية لفك القفل
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
