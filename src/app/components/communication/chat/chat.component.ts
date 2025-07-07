import { UserInfo } from './../../../types/UserInfo';
import { CommonModule, NgClass } from "@angular/common";
import { Component, effect, ElementRef, inject, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChatService } from "../../../core/services/chat.service";
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { SecondsToTimePipe } from '../../../core/Pipe/seconds-to-time.pipe';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  sentAt: Date;
  type?: 'text' | 'file';
  fileName?: string;
}


@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgClass, CommonModule, SecondsToTimePipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  // === Signals ===
  messages = signal<Message[]>([]);
  messageText = signal<string>('');
  clientAvatar = 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=400';
  lawyerAvatar = 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400';

  // === Session Info ===
  sessionId: number = 98498;

  senderId = this.getOrCreateSenderId();

  getOrCreateSenderId(): string {
    const key = 'sender-id';
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(key, id);
    }
    return id;
  }

  chatService = inject(ChatService);
  UserInfo = inject(AuthService);
  sessionService = inject(SessionService);

  data = this.UserInfo.getUserInfo() as UserInfo;
  userName = this.data?.name || 'User';
  ngOnInit(): void {
    //this.sessionService.startSession(0.10);

    this.chatService.startConnection(this.sessionId, this.senderId);

    effect(() => {
      console.log("📥 Updated messages in component:", this.chatService.messages());
    });
  }
  handleSend() {
    this.sessionService.unlockAudio();
    this.sendMessage();
  }

  sendMessage() {
    if (this.sessionService.sessionEnded()) return;
    const text = this.messageText().trim();
    if (!text) return;

    // this.chatService.sendMessage(this.sessionId, this.senderId, text);
    this.chatService.sendMessage(this.sessionId, this.senderId, text);

    this.messageText.set('');
  }


  ngOnDestroy(): void {
    this.chatService.stopConnection();
  }


}



