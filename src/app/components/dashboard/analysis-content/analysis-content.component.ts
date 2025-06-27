import { Component, Input } from '@angular/core';
import { AnalysisCardComponent } from '../tools/analysis-card/analysis-card.component';
import { ProgressBarComponent } from '../tools/progress-bar/progress-bar.component';
import { RevenueLineChartComponent } from '../tools/revenue-line-chart/revenue-line-chart.component';

@Component({
  selector: 'app-analysis-content',
  imports: [
    AnalysisCardComponent,
    ProgressBarComponent,
    RevenueLineChartComponent,
  ],
  templateUrl: './analysis-content.component.html',
  styleUrl: './analysis-content.component.css',
})
export class AnalysisContentComponent {
  data = { Family: 40, Criminal: 70, Civil: 55, Tax: 20, Corporate: 80 };
  revenues = [
    { date: '2024-01-01', amount: 1200 },
    { date: '2024-02-01', amount: 1200 },
    { date: '2025-02-01', amount: 1500 },
    { date: '2025-03-01', amount: 1800 },
    { date: '2025-04-01', amount: 1300 },
    { date: '2025-04-01', amount: 20300 },
    { date: '2025-04-01', amount: 13300 },
    { date: '2025-04-01', amount: 15300 },
    { date: '2025-05-01', amount: 2200 },
    { date: '2025-06-01', amount: 2200 },
    { date: '2025-07-01', amount: 2200 },
  ];
}
