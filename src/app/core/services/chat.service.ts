import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { signal, WritableSignal } from '@angular/core';
import { env } from '../env/env';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../components/models/message';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message';
import { SessionService } from './session.service';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection!: signalR.HubConnection;
  public messages: WritableSignal<any[]> = signal([]);
  private router = inject(Router);
  private _http = inject(HttpClient);
  private sessionService = inject(SessionService);
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
        const formattedMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sessionId,
          senderId: message.senderId,
          text: message.text ?? message.content,
          sentAt: new Date(message.sentAt).toISOString(),

        };

        console.log("📥 Received message:", formattedMessage);

        this.messages.update((msgs) => [...msgs, formattedMessage]);
      });


    }).catch(err => console.error('❌ SignalR connection error:', err));
  }
  sendMessage(
    sessionId: number,
    senderId: string,
    text: string,
    receiverId?: string
  ) {

    this.hubConnection.invoke('SendMessage', sessionId, senderId, text, receiverId)
      .catch(err => console.error("❌ SendMessage Error:", err));
  }



  stopConnection() {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.stop().then(() => {
        console.log('🔌 SignalR disconnected.');
      }).catch(err => {
        console.error('❌ Error while stopping connection:', err);
      });
    }


    const sessionId = 5//this.messages()[0]?.sessionId;

    if (sessionId) {
      this.sessionService.markSessionAsCompleted(sessionId).subscribe({
        next: () => console.log("✅ Session marked as completed."),
        error: err => console.error("❌ Failed to mark session as completed:", err)
      });

      setTimeout(() => {
        this.router.navigate(['/ConsultationReview/' + this.messages()[0].sessionId]);
      }, 4000);
    }
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

