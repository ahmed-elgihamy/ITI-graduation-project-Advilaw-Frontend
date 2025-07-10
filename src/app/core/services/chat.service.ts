import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { signal, WritableSignal } from '@angular/core';
import { env } from '../env/env';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../components/models/message';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection!: signalR.HubConnection;
  public messages: WritableSignal<any[]> = signal([]);
  private router = inject(Router);
  private _http = inject(HttpClient);
  startConnection(sessionId: number, senderId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${env.publicUrl}/chathub`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(() => {
      console.log('✅ SignalR connected');

      this.hubConnection.invoke('JoinSession', sessionId)
        .catch(err => console.error('❌ JoinSession Error:', err));

      this.hubConnection.on('ReceiveMessage', (message) => {
        this.messages.update((msgs) => [...msgs, message]);
      });


    }).catch(err => console.error('❌ SignalR connection error:', err));
  }

  sendMessage(
    sessionId: number,
    senderId: string,
    content: string,
    receiverId?: string
  ) {
    this.hubConnection.invoke('SendMessage', sessionId, senderId, content, receiverId)
      .catch(err => console.error("❌ SendMessage Error:", err));
  }
  stopConnection() {
    this.hubConnection.stop();
    setTimeout(() => {
      this.router.navigate(['/ConsultationReview']);
    }, 4000);
  }
  // playEndSound() {
  //   const audio = new Audio('/assets/sounds/soundend.mp3');
  //   audio.play().catch(err => {
  //     console.warn('🔇 Audio playback failed:', err);
  //   });

  getMessages(sessionId: number): Observable<any> {
    return this._http.get(`${env.baseUrl}/session/${sessionId}/messages`);
  }

}

