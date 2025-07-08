import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ClientService } from '../../../core/services/client.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { ChatDTO } from '../../../types/Chat/ChatDTO';
import { ApiResponse } from '../../../types/ApiResponse';

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
  imports: [ FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements AfterViewInit, OnInit {
  @ViewChild('chatContainer') chatContainerRef!: ElementRef;
  @ViewChild('inputField') inputFieldRef!: ElementRef;

  chatId?: number;
  chatData?: ChatDTO;
  isLoading = false;
  error = '';

  messages: Message[] = [
    {
      id: '1',
      sender: 'lawyer',
      content: 'Hello, how can I help you today?',
      timestamp: '2:35 PM',
      avatar:
        'https://readdy.ai/api/search-image?query=professional%20female%20lawyer...&seq=1',
      senderName: 'Rebecca Johnson',
    },
   
  ];

  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.chatId = params['id'] ? +params['id'] : undefined;
      if (this.chatId) {
        this.loadChatData();
      }
    });
  }

  loadChatData(): void {
    if (!this.chatId) return;

    this.isLoading = true;
    this.error = '';

    // Use mock data service for testing
    this.mockDataService.getMockChatById(this.chatId).subscribe({
      next: (response: ApiResponse<ChatDTO>) => {
        if (response.succeeded) {
          this.chatData = response.data;
        } else {
          this.error = response.message;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading chat:', error);
        this.error = 'Failed to load chat. Please try again.';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();

    const inputField = this.inputFieldRef.nativeElement as HTMLInputElement;
    inputField.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
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
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`;

    this.messages.push({
      id: 1 + Math.random().toString(36).substring(2, 9), // Generate a random ID
      sender: 'client',
      content: message,
      timestamp: formattedTime,
      avatar:
        'https://readdy.ai/api/search-image?query=professional%20business%20person...&seq=2',
      senderName: 'You',
    });

    this.newMessage = '';
    setTimeout(() => this.scrollToBottom(), 0);
  }

  scrollToBottom(): void {
    const container = this.chatContainerRef.nativeElement as HTMLElement;
    container.scrollTop = container.scrollHeight;
  }

  goBack(): void {
    this.router.navigate(['/client/chats']);
  }
}
