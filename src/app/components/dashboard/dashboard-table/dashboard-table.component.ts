import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-table',
  imports: [CommonModule],
  templateUrl: './dashboard-table.component.html',
  styleUrl: './dashboard-table.component.css',
})
export class DashboardTableComponent {
  @Input() data: any[] = [];
  @Input() title: string = 'Dashboard';
  @Input() columns: { key: string; label: string }[] = [];
}
