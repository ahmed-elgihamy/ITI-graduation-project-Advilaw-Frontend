export interface Message {
    id: string;
    senderId: string;
    text: string;
    sentAt: Date;
    type?: 'text' | 'file';
    fileName?: string;
}