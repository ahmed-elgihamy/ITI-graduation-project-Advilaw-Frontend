import { Component, OnInit } from '@angular/core';
import { EscrowService } from '../../../core/services/escrow.service';

@Component({
  selector: 'app-escrow-details',
  templateUrl: './escrow-details.component.html',
  styleUrl: './escrow-details.component.css'
})
export class EscrowDetailsComponent implements OnInit {
  escrows: any[] = [];
  isLoading = false;
  error = '';

  constructor(private escrowService: EscrowService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.escrowService.getClientEscrowPayments().subscribe({
      next: (data) => {
        this.escrows = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load escrow transactions.';
        this.isLoading = false;
        console.error('Escrow API error:', err);
      }
    });
  }
}
