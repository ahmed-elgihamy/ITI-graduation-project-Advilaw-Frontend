import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ChatDTO, ChatStatus } from '../../types/Chat/ChatDTO';
import { PagedResponse } from '../../types/PagedResponse';
import { ApiResponse } from '../../types/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  private mockChats: ChatDTO[] = [
    {
      id: 1,
      jobId: 101,
      jobTitle: 'Business Contract Review',
      lawyerId: 201,
      lawyerName: 'Sarah Johnson',
      lawyerImageUrl: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400',
      clientId: 301,
      clientName: 'John Smith',
      clientImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Thank you for the detailed review. I have some questions about clause 3.',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      unreadCount: 2,
      status: ChatStatus.Active,
      statusCode:200,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      jobId: 102,
      jobTitle: 'Employment Law Consultation',
      lawyerId: 202,
      lawyerName: 'Michael Chen',
      lawyerImageUrl: 'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=400',
      clientId: 301,
      clientName: 'John Smith',
      clientImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'The consultation has been completed successfully.',
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      unreadCount: 0,
      status: ChatStatus.Completed,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            statusCode:200,

    },
    {
      id: 3,
      jobId: 103,
      jobTitle: 'Real Estate Transaction',
      lawyerId: 203,
      lawyerName: 'Emily Rodriguez',
      lawyerImageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      clientId: 301,
      clientName: 'John Smith',
      clientImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'I need to schedule an appointment to discuss the property details.',
      lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      unreadCount: 1,
      status: ChatStatus.Pending,
            statusCode:200,

      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      jobId: 104,
      jobTitle: 'Intellectual Property Rights',
      lawyerId: 204,
      lawyerName: 'David Kim',
      lawyerImageUrl: 'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=400',
      clientId: 301,
      clientName: 'John Smith',
      clientImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Your patent application is being reviewed. I\'ll update you soon.',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      unreadCount: 5,
      status: ChatStatus.Active,
            statusCode:200,

      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 5,
      jobId: 105,
      jobTitle: 'Family Law Mediation',
      lawyerId: 205,
      lawyerName: 'Lisa Thompson',
      lawyerImageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      clientId: 301,
      clientName: 'John Smith',
      clientImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'The mediation session has been scheduled for next week.',
      lastMessageTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      unreadCount: 0,
      status: ChatStatus.Completed,
            statusCode:200,

      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  getMockChats(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResponse<ChatDTO>>> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedChats = this.mockChats.slice(startIndex, endIndex);
    
    const pagedResponse: PagedResponse<ChatDTO> = {
      data: paginatedChats,
      pageNumber: page,
      pageSize: pageSize,
      totalPages: Math.ceil(this.mockChats.length / pageSize),
      totalRecords: this.mockChats.length
    };

    const response: ApiResponse<PagedResponse<ChatDTO>> = {
      data: pagedResponse,
      statusCode: 200,
      succeeded: true,
      message: 'Chats retrieved successfully',
      errors: [],
      meta: null
    };

    return of(response).pipe(delay(500)); // Simulate network delay
  }

  getMockChatById(chatId: number): Observable<ApiResponse<ChatDTO>> {
    const chat = this.mockChats.find(c => c.id === chatId);
    
    if (chat) {
      const response: ApiResponse<ChatDTO> = {
        data: chat,
        statusCode: 200,
        succeeded: true,
        message: 'Chat retrieved successfully',
        errors: [],
        meta: null
      };
      return of(response).pipe(delay(300));
    } else {
      const errorResponse: ApiResponse<ChatDTO> = {
        data: {} as ChatDTO,
        statusCode: 404,
        succeeded: false,
        message: 'Chat not found',
        errors: ['Chat not found'],
        meta: null
      };
      return of(errorResponse).pipe(delay(300));
    }
  }
} 