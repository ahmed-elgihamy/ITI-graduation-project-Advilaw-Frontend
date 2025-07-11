import { AuthService } from './../../../core/services/auth.service';
import { SessionDetails } from './../../../core/models/session-details';
import { Lawyer } from './../../../core/models/lawyer.model';

import { UserInfo } from './../../../types/UserInfo';
import { CommonModule, NgClass } from "@angular/common";
import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChatService } from "../../../core/services/chat.service";
import { SessionService } from '../../../core/services/session.service';
import { SecondsToTimePipe } from '../../../core/Pipe/seconds-to-time.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessage } from '../../../core/models/chat-message';




@Component({
  selector: 'app-chat',

  imports: [FormsModule, NgClass, CommonModule, SecondsToTimePipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  constructor(private router: Router) { }
  // === Signals ===
  // messages = signal<Message[]>([]);
  messageText = signal<string>('');
  clientAvatar = 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=400';
  lawyerAvatar = 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400';

  // === Session Info ===
  sessionId: number = 1;
  ClientName: string = '';
  LawyerName: string = '';
  UserInfo: any;
  chatService = inject(ChatService);
  AuthService = inject(AuthService);

  sessionService = inject(SessionService);
  route = inject(ActivatedRoute);
  senderId = this.AuthService.getUserInfo()?.userId; // Use the logged-in user's ID as senderId
  sessionDetails: any;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  getReceiverId(): string {
    if (!this.UserInfo || !this.sessionDetails) return '';

    if (this.UserInfo.role === 'Client') {
      return this.sessionDetails.lawyerId;
    } else {
      return this.sessionDetails.clientId;
    }
  }




  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.sessionId = +id;

        // ✅ Start chat connection
        this.chatService.startConnection(this.sessionId, this.senderId!);

        // ✅ Get old messages
        this.chatService.getMessages(this.sessionId).subscribe({
          next: (msgs) => {
            console.log("🔵 Messages loaded:", msgs);
            // this.chatService.messages.set(msgs);
            this.chatService.messages.set(
              msgs.map((d: ChatMessage) => ({
                ...d,
                sentAt: new Date(d.sentAt)
              }))
            );
            this.scrollToBottom();
          },
          error: (err) => {
            console.error('❌ Failed to load messages:', err);
          }
        });

        // ✅ Get session details
        this.sessionService.getSessionDetails(this.sessionId).subscribe({
          next: (details) => {
            this.sessionDetails = details;
            this.ClientName = details.clientName;
            this.LawyerName = details.lawyerName;
            this.sessionService.startSession(details.durationHours * 60, details.appointmentTime);
          },
          error: (err) => {
            console.error("🔴 Failed to load session details:", err);
          }
        });

        // ✅ Get current user info
        this.UserInfo = this.AuthService.getUserInfo();
        console.log("User Info:", this.UserInfo);
      }
    });

    // Watch messages updates
    effect(() => {
      console.log("📥 Updated messages in component:", this.chatService.messages());
      this.scrollToBottom();
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

    this.chatService.sendMessage(
      this.sessionId,
      this.senderId!,
      this.messageText(),
      this.getReceiverId()
    );

    this.messageText.set('');
  }


  ngOnDestroy(): void {
    this.chatService.stopConnection();
  }

  goBack(): void {
    this.router.navigate(['/client/chats']);
  }

  formatTimeRange(start: string | Date, durationHours: number): string {
    const startTime = new Date(start);
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);


    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };

    const startStr = startTime.toLocaleTimeString('en-US', options);
    const endStr = endTime.toLocaleTimeString('en-US', options);
    const res = `${startStr} - ${endStr}`;
    return res;
  }

  get chatPartnerName(): string {
    return this.UserInfo.role === 'Client' ? this.LawyerName : this.ClientName;
  }



  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }, 0);
    } catch (err) {
      console.error('❌ Scroll Error:', err);
    }
  }



}



