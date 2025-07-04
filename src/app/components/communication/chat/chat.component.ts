import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConsultationHeaderComponent } from "../consultation-header/consultation-header.component";
import { ConsultationDetailsComponent } from "../consultation-details/consultation-details.component";
import { MessageInpuComponent } from "../message-inpu/message-inpu.component";

interface Message {
  id: string;
  sender: 'lawyer' | 'client';
  content: string;
  timestamp: string;
  avatar: string;
  senderName: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgClass, FormsModule, ConsultationHeaderComponent, ConsultationDetailsComponent, MessageInpuComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewInit {
  @ViewChild('chatContainer') chatContainerRef!: ElementRef;
  @ViewChild('inputField') inputFieldRef!: ElementRef;

  messages: Message[] = [
    {
      id: '1',
      sender: 'lawyer',
      content: 'Hello, how can I help you today?',
      timestamp: '2:35 PM',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20lawyer...&seq=1',
      senderName: 'Rebecca Johnson'
    }
    // ممكن تضيف باقي الرسائل هنا...
  ];

  newMessage: string = '';

  ngAfterViewInit(): void {
    this.scrollToBottom();

    const inputField = this.inputFieldRef.nativeElement as HTMLInputElement;
    inputField.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    });
  }

  sendMessage(): void {
    const message = this.newMessage.trim();
    if (!message) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    this.messages.push({
      id: 1 + Math.random().toString(36).substring(2, 9), // Generate a random ID
      sender: 'client',
      content: message,
      timestamp: formattedTime,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20person...&seq=2',
      senderName: 'You'
    });

    this.newMessage = '';
    setTimeout(() => this.scrollToBottom(), 0);
  }

  scrollToBottom(): void {
    const container = this.chatContainerRef.nativeElement as HTMLElement;
    container.scrollTop = container.scrollHeight;
  }
}
