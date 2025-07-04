import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-inpu',
  imports: [FormsModule],
  templateUrl: './message-inpu.component.html',
  styleUrl: './message-inpu.component.css'
})
export class MessageInpuComponent {
  message = '';
  sendMessage() {
    if (this.message.trim()) {
      console.log('Sending:', this.message);
      this.message = '';
    }
  }
}
