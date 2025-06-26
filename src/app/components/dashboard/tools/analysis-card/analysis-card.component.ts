import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-analysis-card',
  imports: [CommonModule],
  templateUrl: './analysis-card.component.html',
  styleUrl: './analysis-card.component.css',
})
export class AnalysisCardComponent {
  @Input() Name = 'Unknown';
  @Input() Value = 0;
  @Input() IconClass = 'fas fa-user';
  @Input() Color = 'primary';
}
