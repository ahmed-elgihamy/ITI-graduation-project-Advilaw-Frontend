import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { signal, WritableSignal } from '@angular/core';
import { env } from '../env/env';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection!: signalR.HubConnection;
  public messages: WritableSignal<any[]> = signal([]);

  startConnection(sessionId: number, senderId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:44302/chathub`) // backend URL
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

  sendMessage(sessionId: number, senderId: string, content: string) {
    this.hubConnection.invoke('SendMessage', sessionId, senderId, content)
      .catch(err => console.error("❌ SendMessage Error:", err));
  }

  stopConnection() {
    this.hubConnection.stop();
  }
}
