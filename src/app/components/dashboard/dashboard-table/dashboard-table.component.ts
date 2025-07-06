import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-table',
  imports: [CommonModule],
  templateUrl: './dashboard-table.component.html',
  styleUrl: './dashboard-table.component.css',
})
export class DashboardTableComponent {
  constructor(private router: Router) {}
  @Input() data: any[] = [];
  @Input() title: string = 'Dashboard';
  @Input() columns: {
    key: string;
    label: string;
    type?: string;
    link?: string;
    linkKey?: string;
  }[] = [];
  @Input() url: string = '';

  goToDetailsPage(id: number) {
    // console.log(`${this.url}/${id}`);
    this.router.navigate([`/${this.url}`, id]); // example route
  }
}
