import { Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  ApexGrid,
} from 'ng-apexcharts';

@Component({
  selector: 'app-revenue-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './revenue-line-chart.component.html',
  styleUrl: './revenue-line-chart.component.css',
})
export class RevenueLineChartComponent {
  @Input() revenueData: { date: string; amount: number }[] = [];

  chartSeries: ApexAxisChartSeries = [];
  chartDetails: ApexChart = {
    type: 'line',
    height: 350,
    zoom: {
      enabled: false,
    },
  };

  dataLabels: ApexDataLabels = {
    enabled: false,
  };

  stroke: ApexStroke = {
    curve: 'smooth',
  };

  xAxis: ApexXAxis = {
    categories: [],
    type: 'category',
    title: {
      text: 'Date',
    },
  };

  yAxis: ApexYAxis = {
    title: {
      text: 'Revenue ($)',
    },
    min: 0,
  };

  tooltip: ApexTooltip = {
    x: {
      format: 'dd MMM yyyy',
    },
  };

  grid: ApexGrid = {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5,
    },
  };

  ngOnChanges() {
    this.updateChart();
  }

  private updateChart() {
    const grouped: Record<string, { total: number; count: number }> = {};

    this.revenueData.forEach(({ date, amount }) => {
      const monthKey = new Date(date).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      }); // e.g., "Jan 2025"

      if (!grouped[monthKey]) {
        grouped[monthKey] = { total: 0, count: 0 };
      }

      grouped[monthKey].total += amount;
      grouped[monthKey].count += 1;
    });

    const categories: string[] = [];
    const averages: number[] = [];

    for (const month in grouped) {
      categories.push(month);
      const avg = grouped[month].total / grouped[month].count;
      averages.push(Math.round(avg));
    }

    this.chartSeries = [
      {
        name: 'Avg Revenue',
        data: averages,
      },
    ];
    this.xAxis.categories = categories;
  }
}
